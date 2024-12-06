import express from 'express';
import * as likeController from './like.controller.js';
import { TimesLimiter } from '../app/app.middleware.js'
import { validateUserIdMiddleware } from './like.middleware.js';

const router = express.Router({
    prefixKey: "/like"
});

/**
 * 获取当前用户对当前文章/说说/留言 是否点赞
 */
router.post('/like/getIsLikeByIdOrIpAndType', likeController.getIsLikeByIdOrIpAndType);

/**
 * 点赞
 */
router.post('/like/addLike',
    TimesLimiter({
        prefixKey: "like/addLike",
        message: "小黑子你在刷赞，被我发现了！",
        limit: 10,
        windowMs: 60 * 1000,
    }),
    (req, res, next) => {
        if (req.body.type === 1) {
            next();
        } else {
            return validateUserIdMiddleware(req, res, next)
        }
    },
    likeController.addLike
)

/**
 * 取消点赞
 */
router.post('/like/cancelLike', TimesLimiter({
    prefixKey: "like/cancelLike",
    message: "小黑子你在刷取消赞，被我发现了！",
    limit: 10,
    windowMs: 60 * 1000,
}),
    (req, res, next) => {
        if (req.body.type === 1) {
            next();
        } else {
            return validateUserIdMiddleware(req, res, next)
        }
    },
    likeController.cancelLike
);

/**
 * 导出路由
 */
export default router;