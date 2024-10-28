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
    let statusCode;
    let message;

    switch (err.message) {
        case 'NAME_IS_REQUIRED':
            statusCode = 409;
            message = '请提供用户名';
            break;
        case 'PASSWORD_IS_REQUIRED':
            statusCode = 409;
            message = '请提供密码';
            break;
        case 'USER_ALREADY_EXISTS':
            statusCode = 409;
            message = '用户名已存在';
            break;
        case 'USER_DOES_NOT_EXISTS':
            statusCode = 400;
            message = '用户不存在';
            break;
        case 'ILLEGAL_USER_NAME':
            statusCode = 400;
            message = '用户名不合法';
            break;
        case 'PASSWORD_DOES_NOT_MATCH':
            statusCode = 400;
            message = '密码错误';
            break;
        case 'LOGIN_FAILED':
            statusCode = 400;
            message = '登录失败';
            break;
        case 'UPDATE_PASSWORD_FAILED':
            statusCode = 400;
            message = '修改密码失败';
            break;
        case 'PASSWORD_IS_THE_SAME':
            statusCode = 400;
            message = '新密码不能与旧密码相同';
            break;
        case 'UNAUTHORIZED':
            statusCode = 401;
            message = '未授权，请登录后重试';
            break;
        case 'TokenExpiredError':
            statusCode = 401;
            message = 'Token过期';
            break;
        case 'JsonWebTokenError':
            statusCode = 401;
            message = 'Token无效';
            break;
        case 'FILE_TYPE_NOT_SUPPORTED':
            statusCode = 400;
            message = '文件类型不支持！';
            break;
        case 'INVALID_PICTURE_DELETE':
            statusCode = 400;
            message = '无效的图片，已删除！';
            break;
        case 'NOT_FOUND':
            statusCode = 404;
            message = '资源未找到';
            break;
        case 'GET_USER_INFO_FAILED':
            statusCode = 400;
            message = '获取用户信息失败';
            break;
        case 'ADDARTICLEERROR':
            statusCode = 400;
            message = '添加文章失败';
            break;
        case 'UPDATEARTICLEERROR':
            statusCode = 400;
            message = '更新文章失败';
            break;
        case 'DELETEARTICLEERROR':
            statusCode = 400;
            message = '删除文章失败';
        case 'ADDCOMMENTERROR':
            statusCode = 400;
            message = '添加评论失败';
            break;
        case 'LIKEERROR':
            statusCode = 400;
            message = '点赞失败';
            break;
        case 'CANCELLIKEERROR':
            statusCode = 400;
            message = '取消点赞失败';
            break;
        case 'ADDREPLYCOMMENTERROR':
            statusCode = 400;
            message = '添加回复评论失败';
            break;
        case 'DELETECOMMENTERROR':
            statusCode = 400;
            message = '删除评论失败';
            break;
        case 'FILEUPLOADERROR':
            statusCode = 400;
            message = '文件上传失败';
            break;
        case 'UPDATE_USER_INFO_FAILED':
            statusCode = 400;
            message = '修改用户失败';
            break;
        case 'GETTALKLISTERROR':
            statusCode = 400;
            message = '获取说说列表失败';
            break;
        case 'GETTAGLISTERROR':
            statusCode = 400;
            message = '获取标签失败';
            break;
        case 'GETPHOTOSLISTERROR':
            statusCode = 400;
            message = '获取相册列表失败';
            break;
        case 'GETALLALBUMLISTERROR':
            statusCode = 400;
            message = '获取相册所有照片失败';
            break;
        case 'GETNOTIFYLISTERROR':
            statusCode = 400;
            message = '获取消息列表失败';
            break;
        case 'READNOTIFYERROR':
            statusCode = 400;
            message = '阅读消息失败';
            break;
        case 'DELETENOTIFYERROR':
            statusCode = 400;
            message = '删除消息失败';
            break;
        case 'NEWNOTIFYERROR':
            statusCode = 400;
            message = '新增消息失败';
            break;
        case 'GETMESSAGELISTERROR':
            statusCode = 400;
            message = '获取留言列表失败';
            break;
        case 'GETHOTTAGSERROR':
            statusCode = 400;
            message = '获取热门标签失败';
            break
        case 'GETHOTTAGSERROR':
            statusCode = 400;
            message = '获取热门标签失败';
            break;
        case 'SENDMESSAGEERROR':
            statusCode = 400;
            message = '发布留言失败';
            break;
        case 'UPDATEMESSAGEERROR':
            statusCode = 400;
            message = '编辑留言失败';
            break;
        case 'SEARCHMESSAGEERROE':
            statusCode = 400;
            message = '搜索留言失败';
            break;
        case 'GETLINKSERROR':
            statusCode = 400;
            message = '获取友链列表失败';
            break;
        case 'GETLIKESTATUSERROR':
            statusCode = 400;
            message = '获取点赞状态失败';
            break;
        case 'GETDATASTATISTICERROR':
            statusCode = 400;
            message = '获取数据统计失败';
            break;
        case 'GETWEBCONFIGERROR':
            statusCode = 400;
            message = '获取网站配置失败';
            break;
        case 'ADDVIEWERROR':
            statusCode = 400;
            message = '添加访问失败';
            break;
        case 'GETCOMMENTTOTALERROR':
            statusCode = 400;
            message = '获取评论总数失败';
            break;
        case 'GETPARENTCOMMENTLISTERROR':
            statusCode = 400;
            message = '获取父评论列表失败';
            break;
        case 'GETCHILDCOMMENTLISTERROR':
            statusCode = 400;
            message = '获取子评论列表失败';
            break;
        case 'GETCATEGORYLISTERROR':
            statusCode = 400;
            message = '获取分类列表失败';
            break;
        case 'GETARTICLELISTERROR':
            statusCode = 400;
            message = '获取文章列表失败';
            break;
        case 'GETARTICLETIMELINELISTERROR':
            statusCode = 400;
            message = '获取文章时间线列表失败';
            break;
        case 'GETARTICLEDETAILERROR':
            statusCode = 400;
            message = '获取文章详情失败';
            break;
        case 'GETARTICLERECOMMENDERROR':
            statusCode = 400;
            message = '获取文章推荐失败';
            break;
        case 'GETARTICLEBYTAGIDERROR':
            statusCode = 400;
            message = '获取文章标签失败';
            break;
        case 'GETARTICLEBYCATEGORYIDERROR':
            statusCode = 400;
            message = '获取文章分类失败';
            break;
        case 'GETARTICLEHOTERROR':
            statusCode = 400;
            message = '获取热门文章失败';
            break;
        case 'GETARTICLEBYSEARCHERROR':
            statusCode = 400;
            message = '搜索文章失败';
            break;
        case 'ADDREADINGDURATIONERROR':
            statusCode = 400;
            message = '添加阅读时长失败';
            break;
        default:
            statusCode = 500;
            message = '服务暂时出了点问题  ~~';
            break;
    }

    // 发送错误响应
    res.status(statusCode).json({
        code: statusCode,
        message
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



