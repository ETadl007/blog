import * as likeService from './like.service.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.LIKE;

/**
 * 获取当前用户对当前文章/说说/留言 是否点赞
 */

export const getIsLikeByIdOrIpAndType = async (req, res, next) => {


    try {
        const { user_id, type, for_id } = req.body;
        let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
        ip = ip.split(":").pop();
        if (!for_id) {
            return res.send(errorResult(errorCode, "取消点赞对象不能为空"))
        }

        if (!type) {
            return res.send(errorResult(errorCode, "取消点赞类型不能为空"))
        }

        let data;
        if (!user_id) {
            data = await likeService.getIsLikeByIpAndType({ for_id, type, ip });
        } else {
            data = await likeService.getIsLikeByIdAndType({ for_id, type, user_id });
        }

        res.send(result("获取用户是否点赞成功", data))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取用户是否点赞失败", 500))
    }
}

/**
 * 点赞
 */

const typeMap = {
    1: 'article',
    2: 'talk',
    3: 'message',
    4: 'comment'
}

export const addLike = async (req, res, next) => {
    try {
        const { for_id, type, user_id } = req.body;

        let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
        ip = ip.split(":").pop();
        
        const mappedType = typeMap[type];

        // 判断文章/说说/留言是否存在
        const exists = await likeService.blogLikeExists({ type, likeType: mappedType });
        
        if (exists) {
            return next(errorResult(errorCode, "文章/说说/留言不存在", 500))
        }

        if (!for_id) {
            return next(errorResult(errorCode, "点赞对象不能为空", 500))
        }

        if (!type) {
            return next(errorResult(errorCode, "点赞类型不能为空", 500))
        }

        let data;
        if (!user_id) {
            let isLike = await likeService.getIsLikeByIpAndType({ for_id, type, ip });
            if (isLike) {
                return next(errorResult(errorCode, "小黑子，你已经点过赞了，不要贪心哦！", 500))
            }
            data = await likeService.addLike({ for_id, type, ip });
        } else {
            let isLike = await likeService.getIsLikeByIdAndType({ for_id, type, user_id });
            if (isLike) {
                return next(errorResult(errorCode, "小黑子，你已经点过赞了，不要贪心哦！", 500))
            }
            data = await likeService.addLike({ for_id, type, user_id });
        }

        if (!data) {
            return next(errorResult(errorCode, "点赞失败", 500))
        }

        // 检查 type 是否有效并进行映射
        if (!typeMap[type]) {
            return next(errorResult(errorCode, "无效参数", 500))
        }

        res.send(result("点赞成功", data))
    } catch (error) {
        console.log(error);
        return next(errorResult(errorCode, "点赞失败", 500))
    }
}

/**
 * 取消点赞
 */

export const cancelLike = async (req, res, next) => {

    try {
        const { for_id, type, user_id } = req.body;

        let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
        ip = ip.split(":").pop();

        // 检查 type 是否有效并进行映射
        const mappedType = typeMap[type];
        
        // 判断文章/说说/留言是否存在
        const exists = await likeService.blogLikeExists({ type, likeType: mappedType });

        if (exists) {
            return next(errorResult(errorCode, "文章/说说/留言不存在", 500))
        }

        if (!for_id) {
            return next(errorResult(errorCode, "取消点赞对象不能为空", 500))
        }

        if (!type) {
            return next(errorResult(errorCode, "取消点赞类型不能为空", 500))
        }

        let data;
        if (!user_id) {
            let isLike = await likeService.getIsLikeByIpAndType({ for_id, type, ip });
            if (!isLike) {
                return next(errorResult(errorCode, "您没有点过赞，留个赞再走呗！", 500))
            }
            data = await likeService.cancelLike({ for_id, type, ip });
        } else {
            let isLike = await likeService.getIsLikeByIdAndType({ for_id, type, user_id });
            if (!isLike) {
                return next(errorResult(errorCode, "您没有点过赞，留个赞再走呗！", 500))
            }
            data = await likeService.cancelLike({ for_id, type, user_id });
        }

        if (!data){
            return next(errorResult(errorCode, "取消点赞失败", 500))
        }

        res.send(result("取消点赞成功", data))

    } catch (error) {
        console.log(error);
        return next(errorResult(errorCode, "取消点赞失败", 500))
    }
}
