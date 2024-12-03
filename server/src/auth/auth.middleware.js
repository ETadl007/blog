import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../app/app.config.js';

import { result, ERRORCODE, errorResult } from '../result/index.js'
const errorCode = ERRORCODE.AUTH; // 用户权限不足
const tokenErrorCode = ERRORCODE.AUTHTOKEN; // 用户登录过期

/**
 * 验证用户身份
 */
export const authGuard = async (req, res, next) => {

    try {
        const authorization = req.header('Authorization');

        // 验证token
        if (!authorization) return next(errorResult(errorCode, '您没有权限访问，请先登录', 403));

        // 提取 JWT 令牌
        const token = authorization.replace('Bearer ', '');

        if (!token) return next(errorResult(errorCode, '您没有权限访问，请先登录', 403));

        // 验证令牌
        jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, decoded) => {
            
            if (err) {
                return next(errorResult(tokenErrorCode, 'Token无效', 401))
            }

            // 验证通过
            // 在请求主体里添加用户
            req.user = decoded
            
            // 下一步
            next();
            
        });


    } catch (error) {
        console.error("未授权，请先登录:", error);
        if (error.name === "TokenExpiredError") {
            return next(errorResult(tokenErrorCode, '登录已过期，请重新登录', 401));
        }
        if (error.name === "JsonWebTokenError") {
            return next(errorResult(tokenErrorCode, 'Token无效', 401));
        }
        return next(errorResult(tokenErrorCode, '错误的请求', 500));
    }
}

export const validateUserIdMiddleware = (req, res, next) => {

    // 获取请求体中的 user_id
    const { user_id } = req.body;

    // 检查请求体中是否有 user_id
    if (!user_id) {
        return next(errorResult(tokenErrorCode, '错误的请求', 500));
    }

    // 确保 req.username 已经被正确设置
    if (!req.user || !req.body.user_id) {
        return next(errorResult(errorCode, '您没有权限访问，请先登录', 403));
    }

    // 验证JWT令牌
    const { id } = req.user;
    
    // 验证 user_id 是否与 JWT 中的 id 匹配
    if (id !== user_id) {
        return next(errorResult(errorCode, '您没有权限访问，请先登录', 403));
    }

    next();
};

/**
 * 对需要管理员发布信息，但是不建议超级管理员发布信息的接口进行提示
 */
export const needAdminAuthNotNeedSuper = (req, res, next) => {
    const authorization = req.header('Authorization');
    const token = authorization.replace('Bearer ', '');
    const { role, username  } = jwt.decode(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    if (Number(role) !== 1){
        return next(errorResult(errorCode, '普通用户仅限查看', 403));
    }

    if (username == 'admin'){
        return next(errorResult(errorCode, 'admin是配置的用户，没有用户信息', 403));
    }
    next();
}

/**
 * 对需要管理员权限的进行操作进行提示源
 */
export const needAdminAuth = (req, res, next) => {
    const authorization = req.header('Authorization');
    const token = authorization.replace('Bearer ', '');
    const { role } = jwt.decode(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    
    if (Number(role) !== 1) {
        return next(errorResult(errorCode, '普通用户仅限查看', 403));
    }
    next();
}

/**
 * 
 */
export const isSuperAdmin = (req, res, next) => {
    const authorization = req.header('Authorization');
    const token = authorization.replace('Bearer ', '');
    const { username  } = jwt.decode(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    if (username == 'admin'){
        return next(errorResult(errorCode, '管理员信息只可通过配置信息修改', 403));
    }
    next();
}