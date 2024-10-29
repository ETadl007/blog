import express from "express";
import * as authController from "./auth.controller.js";
import { validateLoginData, authGuard } from "./auth.middleware.js";

const router = express.Router({
    prefixKey: '/auth'
});

/**
 * 用户登录
 */
router.post("/user/login", validateLoginData, authController.login);

/**
 * 定义验证登录接口
 */
router.post("/auth/validate", authGuard, authController.validate);

/**
 * 导出路由
 */
export default router;