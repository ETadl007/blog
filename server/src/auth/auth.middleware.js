import * as userService from '../user/user.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PUBLIC_KEY } from '../app/app.config.js';

/**
 * 验证用户登录数据
 */
export const validateLoginData = async (req, res, next) => {

    // 获取数据
    const { username, password } = req.body;

    // 验证必填数据
    if (!username) return next(new Error('NAME_IS_REQUIRED'))
    if (!password) return next(new Error('PASSWORD_IS_REQUIRED'))

    // 验证用户名是否存在
    const user = await userService.getUserByName(username, { password: true });
    if (!user) return next(new Error('USER_DOES_NOT_EXISTS'))

    // 验证用户密码
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'))

    // 在请求主体里添加用户
    req.body.username = user;

    // 下一步
    next();
}

/**
 * 验证用户身份
 */
export const authGuard = async (req, res, next) => {

    try {
        const authorization = req.header('Authorization');

        // 验证token
        if (!authorization) throw new Error();

        // 提取 JWT 令牌
        const token = authorization.replace('Bearer ', '');

        if (!token) throw new Error();

        // 验证令牌
        jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                return next(new Error('UNAUTHORIZED'))
            }

            // 验证通过
            // 在请求主体里添加用户
            req.username = decoded

            // 下一步
            next();
        });


    } catch (error) {
        console.error("未授权，请先登录:", error);
        if (error.name === "TokenExpiredError") {
            return next(new Error('TokenExpiredError'));
        }
        if (error.name === "JsonWebTokenError") {
            return next(new Error('JsonWebTokenError'));
        }
        return next(new Error('UNAUTHORIZED'));
    }
}

export const validateUserIdMiddleware = (req, res, next) => {

    // 获取请求体中的 user_id
    const { user_id } = req.body;

    // 检查请求体中是否有 user_id
    if (!user_id) {
        return res.status(400).send({
            status: 1,
            message: '错误的请求',
            data: null
        });
    }

    // 确保 req.username 已经被正确设置
    if (!req.username || !req.body.user_id) {
        return res.status(401).send({
            status: 1,
            message: '未授权，请先登录',
            data: null
        });
    }

    // 验证JWT令牌
    const { id } = req.username;
    
    // 验证 user_id 是否与 JWT 中的 id 匹配
    if (id !== user_id) {
        return res.status(403).send({
            status: 1,
            message: '不允许的操作',
            data: null
        });
    }

    next();
};