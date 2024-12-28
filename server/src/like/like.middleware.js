import { ERRORCODE, errorResult } from "../result/index.js"
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from "../app/app.config.js";

const tokenErrorCode = ERRORCODE.AUTHTOKEN;
const TIPSCode = ERRORCODE.TIPS;
const errorCode = ERRORCODE.LIKE;

export const validateUserIdMiddleware = (req, res, next) => {

    const authorization = req.header('Authorization');

    // 验证token
    if (!authorization) return next(errorResult(TIPSCode, '小黑子，请先登录', 429));

    // 提取 JWT 令牌
    const token = authorization ? authorization.replace("Bearer ", "") : undefined;

    if (!token) return next(errorResult(TIPSCode, '小黑子，请先登录', 429));

    // 验证令牌
    jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, decoded) => {

        if (err) {
            return next(errorResult(tokenErrorCode, '无效的令牌，小黑子，别挣扎了！', 401))
        }

        // 验证通过
        // 在请求主体里添加用户
        req.user = decoded

        // 获取请求体中的 user_id
        const { user_id } = req.body;

        // 确保 req.username 已经被正确设置
        if (!req.user || !user_id) {
            return next(errorResult(errorCode, '错误的请求', 500));
        }

        // 验证JWT令牌
        const { id } = req.user;

        // 验证 user_id 是否与 JWT 中的 id 匹配
        if (id !== user_id) {
            return next(errorResult(errorCode, '错误的请求', 500));
        }
        // 下一步
        next();

    });
};