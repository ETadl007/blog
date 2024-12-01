import app from "./app/index.js";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "../uploads/images")));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/**
 * 未定义的路由处理
 */
app.use((req, res, next) => {
    res.status(404).render('error', {
      error: { stack: "Not Found" }
    });
  });
  

// 请求日志
app.use((req, res, next) => {
    const start = new Date();
    next();
    const ms = new Date() - start;
    console.log(`${req.method} ${req.url} - ${ms}ms`);
});

export default app;