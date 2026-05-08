import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import crypto from "crypto";
import { User } from "./src/models/User";

dotenv.config();

function createSign(params: Record<string, any>, key: string): string {
  const sortedKeys = Object.keys(params).sort();
  const filteredParams = sortedKeys.filter(k =>
    k !== 'sign' && k !== 'sign_type' && params[k] !== '' && params[k] !== undefined && params[k] !== null
  );
  const str = filteredParams.map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('md5').update(str + key).digest('hex');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Database connection
  if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("Could not connect to MongoDB", err));
  } else {
    console.warn("MONGODB_URI is not set");
  }

  // Admin and User Routes
  app.get("/api/admin/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
  });

  app.post("/api/admin/users/:id/balance", async (req, res) => {
    const { amount } = req.body;
    await User.findByIdAndUpdate(req.params.id, { $inc: { balance: amount } });
    res.json({ success: true });
  });

  app.get("/api/user/:openId", async (req, res) => {
    const user = await User.findOne({ openId: req.params.openId });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // WeChat Auth
  app.get("/api/auth/wechat/login", (req, res) => {
    const redirectUri = encodeURIComponent(`${process.env.APP_URL}/api/auth/wechat/callback`);
    const authUrl = `${process.env.WECHAT_PROXY_HOST}?appid=${process.env.WECHAT_APP_ID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    res.redirect(authUrl);
  });

  app.get("/api/auth/wechat/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("No code provided");
    
    // Simulate Wechat login for demo:
    const mockOpenId = "mock_openid_" + code;
    let user = await User.findOne({ openId: mockOpenId });
    if (!user) user = await User.create({ openId: mockOpenId, nickname: "User_" + code });
    
    res.redirect(`${process.env.APP_URL}/?openId=${mockOpenId}`);
  });

  // Easy Pay
  app.post("/api/payment/create", async (req, res) => {
    const { name, money, type, openId } = req.body;
    const out_trade_no = Date.now().toString();
    const params = {
      pid: process.env.EASY_PAY_PID,
      type: type || 'wxpay',
      out_trade_no,
      notify_url: process.env.EASY_PAY_NOTIFY_URL,
      name,
      money,
      clientip: req.ip,
      sign_type: 'MD5',
      param: openId
    };

    const sign = createSign(params, process.env.EASY_PAY_KEY!);
    
    try {
      const response = await axios.post(process.env.EASY_PAY_API_URL!, new URLSearchParams(params as any).toString() + `&sign=${sign}`);
      res.json(response.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "支付请求失败" });
    }
  });

  app.get("/api/payment/notify", async (req, res) => {
    if (req.query.trade_status === 'TRADE_SUCCESS') {
      const openId = req.query.param as string;
      const amount = parseFloat(req.query.money as string);
      await User.findOneAndUpdate({ openId }, { $inc: { balance: amount * 1000 } });
      return res.send('success');
    }
    res.send('fail');
  });

  app.post("/api/detect", async (req, res) => {
    const { text, openId } = req.body;
    if (!text || text.length < 200 || text.length > 5000) {
      return res.status(400).json({ error: "文本长度需在200-5000字符之间" });
    }

    const user = await User.findOne({ openId });
    if (!user || user.balance < text.length) {
      return res.status(403).json({ error: "余额不足，请充值" });
    }

    const tms = require("tencentcloud-sdk-nodejs-tms");
    const tmsClient = tms.v20201229.Client;
    const client = new tmsClient({
      credential: {
        secretId: process.env.TENCENT_CLOUD_SECRET_ID,
        secretKey: process.env.TENCENT_CLOUD_SECRET_KEY,
      },
      region: "ap-guangzhou",
      profile: { httpProfile: { endpoint: "tms.tencentcloudapi.com" } },
    });

    try {
      const result = await client.TextModeration({
        Content: Buffer.from(text).toString('base64'),
        Type: "TEXT_AIGC",
        BizType: "laohei",
      });
      
      user.balance -= text.length;
      await user.save();
      
      res.json({ ...result, balance: user.balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "检测失败" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
