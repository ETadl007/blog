import express from 'express';

const router = express.Router();

// 随便写的一个欢迎
router.get("/", (req, res, next) => {
    res.send("欢迎 这是后台server首页")
});

export default router;