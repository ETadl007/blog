import dotenv from "dotenv";
import { rateLimit } from 'express-rate-limit'

dotenv.config();

/**
 * 输出请求地址
 */
export const requestUrl = (req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
};

/**
 *  默认异常处理
 */
export const defaultErrorHandler = (err, req, res, next) => {
    let status = err.status || 500;  // 设置默认状态码

    // 根据错误代码判断具体状态码
    switch (err.code) {
        case "100002":
            // 没有权限
            status = 403;
            break;
        case "100016":
            // token 过期 需要重新登录
            status = 401;
            break;
        default:
            status = 500;  // 默认为 500
    }

    // 发送错误响应
    res.status(status).send({
        code: err.code,
        message: err.message
    });
};



/**
 * 限制自动化脚本测试网站
 */
export const TimesLimiter = (options) => {
    if (!Object.getOwnPropertyNames(options).includes("prefixKey")) {
        console.error("TimesLimiter: prefixKey is required");
    }

    const defaultOptions = {
        windowMs: 1 * 60 * 1000, // 1分钟
        prefixKey: "",
        limit: 10, // 10次
        message: "小黑子，你在刷接口，请稍后再试！", 
        handler: (req, res, /*next*/) => {
            return res.status(429).send({ error: options.message || defaultOptions.message });
        },
        keyGenerator: (req) => `${options.prefixKey}:${req.ip}`
    };

    // 合并传入的选项和默认选项
    const finalOptions = { ...defaultOptions, ...options };

    // 返回一个新的 rateLimit 实例
    return rateLimit(finalOptions);
}



