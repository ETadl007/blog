import bcrypt from 'bcryptjs';
import * as userService from './user.service.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.USER;

/**
 * 校验用户名和密码是否合法
 */
export const userValidate = async (req, res, next) => {
    const { username, password } = req.body;

    // 验证必填数据
    if (!username) return next(errorResult(errorCode, "请提供用户名", 500))
    if (!password) return next(errorResult(errorCode, "请提供密码", 500))

    if (!/^[A-Za-z0-9]+$/.test(username)) {
        return next(errorResult(errorCode, "用户名只能包含字母和数字", 500))
    }

    next();
}

/**
 * 校验用户名是否已经注册过
 */
export const verifyUser = async (req, res, next) => {
    const { username } = req.body;
    try {

        if (username == 'admin') {
            console.log('admin已存在');
            return next(errorResult(errorCode, "admin用户已存在", 500))
        }

        // 验证用户名是否存在        
        const user = await userService.getUserByName(username);
        if (user) return next(errorResult(errorCode, "用户名已存在", 500))

    } catch (error) {
        return next(errorResult(errorCode, "用户名验证失败", 500))
    }
    // 下一步
    next();
}

/**
 *  HASH 密码
 */
export const hashPassword = async (req, res, next) => {
    const { password } = req.body;

    // HASH 密码
    req.body.password = await bcrypt.hash(password, 10);

    next();
}

/**
 * 判断用户名和密码匹配
 */
export const verifyLogin = async (req, res, next) => {

    const { username, password } = req.body;

    try {
        if (username !== 'admin') {

            if (username === '') return next(errorResult(errorCode, "用户名不能为空", 500))

            // 检查用户是否提供密码
            if (password === '') return next(errorResult(errorCode, "密码不能为空", 500))

            // 调取用户数据
            const user = await userService.getUserByName(username, { password: true });

            // 验证用户是否存在
            if (!user) return next(errorResult(errorCode, "用户不存在，请先注册", 500))

            // 验证密码是否匹配
            const matched = await bcrypt.compare(password, user.password)

            if (!matched) {
                return next(errorResult(errorCode, "密码错误", 500))
            }

        }

    } catch (error) {
        return next(errorResult(errorCode, "登录失败", 500))
    }

    // 下一步
    next();

}

/**
 * 
 */
export const verifyUpdatePassword = async (req, res, next) => {
    try {
        const { password, password1, password2 } = req.body;

        const { id, username } = req.user

        if (username !== 'admin') {

            if (password1 != password2 ) return next(errorResult(errorCode, "两次密码输入不一致", 500))

            // 验证用户是否提供正确的旧密码
            const user = await userService.getUserById(id, { password: true });

            // 验证用户是否存在
            if (!user) return next(errorResult(errorCode, "用户不存在", 500))

            // 验证密码是否匹配
            const matched = await bcrypt.compare(password, user.password)
            if (!matched) {
                return next(errorResult(errorCode, "密码错误", 500))
            }
        }else {
            return next(errorResult(errorCode, "admin用户不存在", 500))
        }

    } catch (error) {
        return next(errorResult(errorCode, "修改密码失败", 500))
    }

    // 下一步
    next();

}