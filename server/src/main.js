import app from "./app/index.js";
import express from "express";
import path from "path";
import history from "express-history-api-fallback";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "../uploads/images")));


// 请求日志
app.use((req, res, next) => {
    const start = new Date();
    next();
    const ms = new Date() - start;
    console.log(`${req.method} ${req.url} - ${ms}ms`);
});

// const root = path.join(__dirname, 'views');
// const fallbackFile = 'error.html';

// app.use(history(fallbackFile, { root }));

export default app;