import express from 'express';
import * as commentController from './comment.controller.js';
import { filterSensitiveMiddleware } from './comment.middleware.js';
import { authGuard, needAdminAuthNotNeedSuper } from '../auth/auth.middleware.js'
import { TimesLimiter } from '../app/app.middleware.js'

const router = express.Router({
    prefixKey: '/comment'
});

/**
 * 根据文章id获取评论总数
 */
router.post('/comment/getCommentTotal', commentController.getCommentTotal);

/**
 * 分页查找父级评论
 */
router.post('/comment/frontGetParentComment', commentController.getParentCommentList);

/**
 * 分页查找子评论
 */
router.post('/comment/frontGetChildrenComment', commentController.getChildCommentList);

/**
 * 分页获取所有评论
 */
router.post('/comment/getAllComment', authGuard, commentController.getAllCommentList);

/**
 * 添加评论
 */
router.post('/comment/add', authGuard, filterSensitiveMiddleware, TimesLimiter({
    prefixKey: "/comment/add",
    message: "小黑子停手吧，你被我发现了！",
    limit: 10,
}), commentController.addComment);

/**
 * 添加回复评论
 */

router.post('/comment/apply', authGuard, filterSensitiveMiddleware, TimesLimiter({
    prefixKey: "/comment/apply",
    message: "小黑子停手吧，你被我发现了！",
    limit: 10,
}), commentController.addReplyComment);

/**
 * 删除评论
 */
router.delete('/comment/delete/:id/:parent_id', authGuard, commentController.deleteComment)

/**
 * 后台批量删除评论
 */
router.put('/comment/backDelete', authGuard, needAdminAuthNotNeedSuper, commentController.backDeleteComment)

/**
 * 导出路由
 */
export default router;