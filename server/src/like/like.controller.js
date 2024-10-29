import * as likeService from './like.service.js';

/**
 * 获取当前用户对当前文章/说说/留言 是否点赞
 */

export const getLikeStatus = async (req, res, next) => {

    const { user_id, type, for_id } = req.body;

    try {

        const likeStatus = await likeService.getIsLikeByIdAndType({ user_id, type, for_id });

        res.send({
            status: 0,
            data: likeStatus
        })

    } catch (err) {
        console.log(err);
        next(new Error('GETLIKESTATUSERROR'));
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

    const { for_id, type, user_id } = req.body;

    try {

        // 检查 type 是否有效并进行映射
        if (!typeMap[type]) {
            return res.status(400).send({
                status: 1,
                message: '无效的 type',
                data: null
            });
        }

        const mappedType = typeMap[type];

        // 判断文章/说说/留言是否存在
        const exists = await likeService.blogLikeExists({ for_id, type: mappedType });

        // 判断文章/说说/留言是否存在
        if (!exists) {
            return res.status(400).send({
                status: 1,
                message: '文章/说说/留言不存在',
                data: null
            });
        }

        // 判断用户是否已经点赞过
        const isLiked = await likeService.getIsLikeByIdAndType({ user_id, type, for_id });

        if (isLiked) {
            return res.status(400).send({
                status: 1,
                message: '小黑子，你已经点过赞了，不要贪心哦！',
                data: null
            });
        }

        const result = await likeService.addLike({ for_id, type, user_id });

        res.send({
            status: 0,
            message: '点赞成功',
            data: result
        })
    } catch (error) {
        console.log(error);
        next(new Error('LIKEERROR'));
    }
}

/**
 * 取消点赞
 */

export const cancelLike = async (req, res, next) => {

    const { for_id, type, user_id } = req.body;

    try {

        // 检查 type 是否有效并进行映射
        if (!typeMap[type]) {
            return res.status(400).send({
                status: 1,
                message: '无效的 type',
                data: null
            });
        }

        const mappedType = typeMap[type];

        // 判断文章/说说/留言是否存在
        const exists = await likeService.blogLikeExists({ for_id, type: mappedType });

        // 判断文章/说说/留言是否存在
        if (!exists) {
            return res.status(400).send({
                status: 1,
                message: '文章/说说/留言不存在',
                data: null
            });
        }

        // 判断用户是否已经取消点赞
        const isLiked = await likeService.getIsLikeByIdAndType({ user_id, type, for_id });
        // 用户没有点赞过
        if (!isLiked) {
            return res.status(400).send({
                status: 1,
                message: '哎呀，小黑子，你还没有点赞哦！是不是手滑了？',
                data: null
            });
        }
        const result = await likeService.cancelLike({ for_id, type, user_id });

        res.send({
            status: 0,
            message: '取消点赞成功',
            data: result
        })
    } catch (error) {
        console.log(error);
        next(new Error('CANCELLIKEERROR'));
    }
}
