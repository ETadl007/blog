import * as messageService from './message.service.js';
import { PAGE_SIZE } from '../app/app.config.js';
import { randomNickname } from '../utils/tool.js'
import { filterSensitive } from '../utils/sensitive.js'
import { addNotify } from '../notify/notify.controller.js'

/**
 * 获取留言列表
 */

export const getMessage = async (req, res, next) => {
    // 当前页码
    let { current = 1, size, user_id = null, tag = '', message = '' } = req.body;

    // 每页内容数量
    const limit = parseInt(PAGE_SIZE, 10) || 6;

    // 偏移量
    const offset = (current - 1) * limit;

    try {
        const result = await messageService.getMessageList({ limit, offset, user_id, tag, message });
        const total = await messageService.getMessageTotal({ tag, message });
        res.send({
            status: 0,
            message: '获取留言列表成功',
            data: {
                current,
                size,
                list: result,
                total
            }
        });
    } catch (err) {
        console.log(err);
        next(new Error('GETMESSAGELISTERROR'))
    }
}

/**
 * 获取热门标签
 */
export const getMessageHotTags = async (req, res, next) => {
    try {
        const messageHotTags = await messageService.getMessageHotTags();
        res.send({
            status: 0,
            message: '获取热门标签成功',
            data: messageHotTags
        });
    } catch (err) {
        console.log(err);
        next(new Error('GETHOTTAGSERROR'))
    }
}

/**
 * 发布留言
 */
export const addMessage = async (req, res, next) => {

    try {

        let { message, user_id, nick_name, color, font_size, font_weight, bg_color, bg_url, tag } = req.body

        if (!user_id) {
            nick_name = randomNickname('游客', 5)
        }

        // 过滤敏感词
        message = await filterSensitive(message)

        const createdAt = new Date()

        const result = await messageService.addMessage({ message, nick_name, user_id, color, font_size, font_weight, bg_color, bg_url, tag, createdAt });

        // 发布消息推送
        if (user_id !== 1) {
            await addNotify({
                user_id: 1,
                type: 3,
                message: `您收到了来自于：${nick_name} 的留言: ${message}！`,
            })
        }
        res.send({
            status: 0,
            message: '发布留言成功',
            data: result
        });

    } catch (err) {
        console.log(err);
        next(new Error('SENDMESSAGEERROR'))
    }

}

/**
 * 删除留言
 */
export const deleteMessage = async (req, res, next) => {
    try {
        const { idList } = req.body;
        if (!Array.isArray(idList) || idList.length === 0) {
            return res.status(400).send({
                status: 1,
                message: '无效的参数，无法删除留言'
            });
        }
        const result = await messageService.deleteMessage(idList);
        res.send({
            status: 0,
            message: '删除留言成功',
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('DELETEMESSAGEERROR'))
    }
}

/**
 * 编辑留言
 */
export const updateMessage = async (req, res, next) => {
    try {
        let { id, message, color, font_size, font_weight, bg_color, bg_url, tag } = req.body;

        // 过滤敏感词
        message = await filterSensitive(message)

        const result = await messageService.updateMessage({ message, color, font_size, font_weight, bg_color, bg_url, tag, id });
        res.send({
            status: 0,
            message: '编辑留言成功',
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('UPDATEMESSAGEERROR'))
    }
}

/**
 * 搜索留言
 */

export const searchMessage = async () => {
    try {
        let { message } = req.body;

        // 每页内容数量
        const limit = parseInt(PAGE_SIZE, 10) || 6;

        // 偏移量
        const offset = (current - 1) * limit;

        // 过滤敏感词
        const filteredMessage = await filterSensitive(message);

        // 如果消息包含敏感词
        if (filteredMessage.indexOf("*") !== -1) {
            return res.status(400).send({
                status: 1,
                message: '包含敏感词，无法进行搜索',
                data: null
            });
        }

        const result = await messageService.searchMessage({ message: filteredMessage, limit, offset });
        res.send({
            status: 0,
            message: '通过关键字查询成功',
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error("SEARCHMESSAGEERROE"))
    }
}