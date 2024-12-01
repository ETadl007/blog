import * as talkService from './talk.service.js';
import { PAGE_SIZE } from '../app/app.config.js';

/**
 * 前台获取说说列表
 */
export const blogGetTalkList = async (req, res, next) => {
    try {
        const { current, size, user_id = null } = req.body;

        // 每页内容数量
        const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

        // 偏移量
        const offset = (current - 1) * limit;

        const talk = await talkService.blogGetTalkList({limit, offset, user_id});
        res.send({
            status: 0,
            message: '获取说说列表成功',
            data: talk
        });
    } catch (err) {
        console.log(err);
        next(new Error('GETTALKLISTERROR'))
    }
}

/**
 * 后台获取说说列表
 */
export const getTalkList = async (req, res, next) => {
    // 当前页码
    let { current, size, user_id = null, status } = req.body;

    // 每页内容数量
    const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

    // 偏移量
    const offset = (current - 1) * limit;

    try {
        const talk = await talkService.getTalkList({limit, offset, user_id, status});
        res.send({
            status: 0,
            message: '获取说说列表成功',
            data: talk
        });
    } catch (err) {
        console.log(err);
        
        next(new Error('GETTALKLISTERROR'))
    }
}

/**
 * 发布说说
 */
export const publishTalk = async (req, res, next) => {
    try {
        const result = await talkService.publishTalk(req.body);
        res.send({
            status: 0,
            message: '发布说说成功',
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('GETTALKLISTERROR'))
    }
}

/**
 * 修改说说
 */
export const updateTalk = async (req, res, next) => {
    try {
        const result = await talkService.updateTalk(req.body);
        res.send({
            status: 0,
            message: '修改说说成功',
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('UPDATETALKERROR'))
    }
}

/**
 * 根据id 获取说说详情
 */
export const getTalkById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const talk = await talkService.getTalkById(id);
        res.send({
            status: 0,
            message: '获取说说详情成功',
            data: talk
        });
    } catch (err) {
        console.log(err);
        next(new Error('GETTALKLISTERROR'))
    }
}

/**
 * 切换置顶状态
 */
export const toggleTop = async (req, res, next) => {
    try {
        const { id, is_top } = req.params;
        let message = Number(is_top) == 1 ? "置顶" : "取消置顶";
        const result = await talkService.toggleTop(id, is_top);
        res.send({
            status: 0,
            message: `${message}说说成功`,
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('TOGGLETOPERROR'))
    }
}

/**
 * 恢复说说
 */
export const recoverTalk = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await talkService.revertTalk(id);
        res.send({
            status: 0,
            message: '恢复说说成功',
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('RECOVERTALKERROR'))
    }
}

/**
 * 删除说说
 */
export const deleteTalk = async (req, res, next) => {
    try {
        const { id, status } = req.params;
        let message = Number(status) == 3 ? "删除" : "回收";
        const result = await talkService.deleteTalkById(id, status);
        res.send({
            status: 0,
            message: `${message}说说成功`,
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('DELETETALKERROR'))
    }
}

/**
 * 公开/私密说说
 */
export const togglePublic = async (req, res, next) => {
    try {
        const { id, status } = req.params;
        let message = Number(status) == 1 ? "公开" : "私密";
        const result = await talkService.togglePublic(id, status);
        res.send({
            status: 0,
            message: `${message}说说成功`,
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('TOGGLEPUBLICERROR'))
    }
}