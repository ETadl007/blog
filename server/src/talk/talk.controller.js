import * as talkService from './talk.service.js';
import { PAGE_SIZE } from '../app/app.config.js';

/**
 * 获取说说列表
 */

export const getTalkList = async (req, res, next) => {
    // 当前页码
    let { current = 1, size, user_id = null } = req.body;

    // 每页内容数量
    const limit = parseInt(PAGE_SIZE, 10) || 6;

    // 偏移量
    const offset = (current - 1) * limit;

    try {
        const talk = await talkService.getTalkList({limit, offset, user_id});
        const total = await talkService.getTalkCount();
        res.send({
            status: 0,
            message: '获取说说列表成功',
            data: {
                current,
                size,
                list: talk,
                total
            }
        });
    } catch (err) {
        next(err)
    }
}

/**
 * 说说点赞
 */

export const likeTalk = async (req, res, next) => {
    const { talkId } = req.body;
    try {        
        const result = await talkService.addTalkLike(talkId);
        res.send({
            status: 0,
            message: '点赞成功',
            data: result
        });
    } catch (error) {
        console.log(error);
        next(new Error('LIKEERROR'))
    }
}

/**
 * 取消说说点赞
 */

export const unlikeTalk = async (req, res, next) => {
    const { talkId } = req.body;  
    try {
        const result = await talkService.cancelTalkLike(talkId);
        res.send({
            status: 0,
            message: '取消点赞成功',
            data: result
        });
    } catch (error) {
        console.log(error);
        next(new Error('CANCELLIKEERROR'))
    }
}