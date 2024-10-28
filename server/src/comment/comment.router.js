import express from 'express';
import * as commentController from './comment.controller.js';
import { filterSensitiveMiddleware } from './comment.middleware.js';
import { authGuard } from '../auth/auth.middleware.js'
import * as likeService from '../like/like.controller.js'

const router = express.Router({
    prefixKey: '/comment'
});

/**
 * 根据文章id获取评论总数
 */
router.post('/api/comment/getCommentTotal', commentController.getCommentTotal);

/**
 * 分页查找父级评论
 */
router.post('/api/comment/frontGetParentComment', commentController.getParentCommentList);

/**
 * 分页查找子评论
 */
router.post('/api/comment/frontGetChildrenComment', commentController.getChildCommentList);

/**
 * 添加评论
 */

router.post('/api/comment/add', authGuard, filterSensitiveMiddleware, commentController.addComment);

/**
 * 添加回复评论
 */

router.post('/api/comment/apply', authGuard, filterSensitiveMiddleware, commentController.addReplyComment);

/**
 * 删除评论
 */
router.delete('/api/comment/delete/:id/:parent_id', authGuard, commentController.deleteComment)


/**
 * 导出路由
 */
export default router;