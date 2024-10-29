import express from 'express';
import * as userController from './user.controller.js';
import { validateUserData, hashPassword, validatePassword } from './user.midddleware.js';
import { authGuard } from '../auth/auth.middleware.js'

const router = express.Router({
    prefixKey: '/user'
});


/**
 * 用户注册
 */
router.post('/user/register', validateUserData, hashPassword,  userController.store);

/**
 * 获取当前登录用户信息
 */
    
router.get("/user/getUserInfoById/:id", userController.getUserInfoById);

/**
 * 更新当前登录用户信息
 */
router.put("/user/updateOwnUserInfo/", authGuard, userController.updateOwnUserInfo);


/**
 * 修改密码
 */
router.put("/user/updatePassword", authGuard, validatePassword, userController.updatePassword);

/**
 * 导出路由
 */
export default router;