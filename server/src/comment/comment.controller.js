import * as commentService from './comment.service.js';
import { PARENT_COMMENT_PAGE_SIZE } from '../app/app.config.js';
import { sqlFragment } from './comment.provider.js';
import { addNotify } from "../notify/notify.controller.js";
import { filterSensitive } from "../utils/sensitive.js";



/**
 * 获取评论总数
 * type: 1 文章评论 2 说说评论
 * for_id: 文章id 或者 说说id
 */
export const getCommentTotal = async (req, res, next) => {
    const { for_id, type } = req.body;

    try {
        const commentTotal = await commentService.blogCommentTotalService(for_id, type);
        res.send({
            status: 0,
            msg: '获取评论总数成功',
            data: commentTotal
        });
    } catch (err) {
        console.log(err);
        next(new Error('GETCOMMENTTOTALERROR'));
    }
}

/**
 * 分页查找父级评论成功
 * type: 1 文章评论 2 说说评论
 */

export const getParentCommentList = async (req, res, next) => {
    // 当前页码
    let { current, size, for_id, order, type, user_id } = req.body;

    // 每页评论数量
    const limit = parseInt(PARENT_COMMENT_PAGE_SIZE, 10) || 3;

    // 偏移量
    const offset = (current - 1) * limit;

    // 排序方式
    const orderArr = order == 'new' ? sqlFragment.commentOrderNew : sqlFragment.commentOrderHot

    try {
        const list = await commentService.blogCommentParentListService({ for_id, type, orderArr, limit, offset, user_id });
        const total = await commentService.blogCommentService(for_id, type);
        res.send({
            status: 0,
            msg: '分页查找父评论成功',
            data: {
                current,
                size,
                total,
                list
            }

        });

    } catch (err) {
        console.log(err);
        next(new Error('GETPARENTCOMMENTLISTERROR'));
    }
}

/**
 * 获取子级评论列表
 */

export const getChildCommentList = async (req, res, next) => {
    try {
        const { current, size, type, for_id, user_id, parent_id } = req.body;

        // 每页内容数量
        const limit = parseInt(PARENT_COMMENT_PAGE_SIZE, 10) || 3;

        // 偏移量
        const offset = (current - 1) * limit;
        
        const list = await commentService.blogCommentChildrenListService({parent_id, limit, offset, user_id});
        const total = await commentService.blogCommentService(for_id, type, parent_id);
        res.send({
            status: 0,
            msg: '分页查找子评论成功',
            data: {
                current,
                size,
                total,
                list
            }
        });

    } catch (err) {
        next(new Error('GETCHILDCOMMENTLISTERROR'));
    }
}

/**
 * 添加评论
 */

export const addComment = async (req, res, next) => {
    const { type, for_id, from_id, from_name, from_avatar, content } = req.body;

    const createdAt = new Date()
    const params = [type, for_id, from_id, from_name, from_avatar, content, createdAt]
    try {
        const result = await commentService.blogCommentAddService(params);
        const userinfo = await commentService.getUserInfoByUserId(from_id);
        res.send({
            status: 0,
            msg: '添加评论成功',
            data: {
                res: userinfo
            }
        });
    } catch (err) {
        console.log(err);
        next(new Error('ADDCOMMENTERROR'));
    }
}

/**
 * 添加回复评论
 */
export const addReplyComment = async (req, res, next) => {

    try {

        const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
        req.body.content = await filterSensitive(req.body.content);

        const comment = { ...req.body, ip: ip.split(':').pop() };

        const { type, for_id, from_name, content, from_id, to_id } = req.body;

        const result = await commentService.applyComment(comment)

        if (from_id !== to_id) {
            await addNotify({
                user_id: to_id,
                type: type,
                to_id: for_id,
                message: `您收到了来自 ${from_name} 的评论回复: ${content}！`,
            });
        }

        res.send({
            status: 0,
            msg: '添加回复评论成功',
            data: {
                res: result
            }
        });

    } catch (err) {
        console.log(err);
        next(new Error('ADDREPLYCOMMENTERROR'));
    }
}

/**
 * 删除评论
 */

export const deleteComment = async (req, res, next) => {
    const { id, parent_id } = req.params;

    try {
        const result = await commentService.deleteComment(id, parent_id);
        res.send({
            status: 0,
            message: "删除评论成功",
            data: {
                res: result
            }
        });
    } catch (err) {
        console.log(err);
        next(new Error('DELETECOMMENTERROR'));
    }

}