import express from "express";
import * as authController from "./auth.controller.js";
import { authGuard } from "./auth.middleware.js";

const router = express.Router({
    prefixKey: '/auth'
});

/**
 * 定义验证登录接口
 */
router.post("/auth/validate", authGuard, authController.validate);

/**
 * 导出路由
 */
export default router;