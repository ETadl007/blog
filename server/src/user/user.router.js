import express from 'express';
import * as userController from './user.controller.js';
import { verifyUser, hashPassword, verifyLogin, userValidate, verifyUpdatePassword } from './user.midddleware.js';
import { authGuard, needAdminAuth, isSuperAdmin } from '../auth/auth.middleware.js'

const router = express.Router({
    prefixKey: '/user'
});

/**
 * 用户登录
 */
router.post("/user/login", userValidate, verifyLogin, userController.login);


/**
 * 用户注册
 */
router.post('/user/register', verifyUser, hashPassword,  userController.store);

/**
 * 获取当前登录用户信息
 */
router.get("/user/getUserInfoById/:id", userController.getUserInfoById);

/**
 * 更新当前登录用户信息
 */
router.put("/user/updateOwnUserInfo/", authGuard, isSuperAdmin, userController.updateOwnUserInfo);

/**
 * 修改密码
 */
router.put("/user/updatePassword", authGuard, isSuperAdmin, verifyUpdatePassword, userController.updatePassword);

/**
 * 分页获取用户列表
 */
router.post("/user/getUserList", authGuard, userController.getUserList);

/**
 * 修改角色
 */
router.put("/user/updateRole/:id/:role", authGuard, needAdminAuth, userController.updateRole);

/**
 * 管理员根据用户id修改用户的信息
 */
router.put("/user/adminUpdateUserInfo/", authGuard, needAdminAuth, userController.adminUpdateUserInfo);

/**
 * 导出路由
 */
export default router;