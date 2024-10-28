import * as notifyService from './notify.service.js';
import { PAGE_SIZE } from '../app/app.config.js';

/**
 * 分页获取消息列表
 */
export const getNotifyList = async (req, res, next) => {

    // 当前页码
    const { current, size, userId } = req.body;

    // 偏移量
    const offset = (current - 1) * size;

    try {

        const notifyList = await notifyService.getNotifyList({userId, size, offset});

        // 总条数
        const total = await notifyService.getNotifyTotal(userId);

        res.send({
            status: 0,
            message: '获取消息列表成功',
            data: {
                current,
                size,
                list: notifyList,
                total
            }
        })

    } catch (err) {
        console.log(err);
        next(new Error('GETNOTIFYLISTERROR'));
    }
}

/**
 * 阅读消息列表
 */

export const readNotifyList = async (req, res, next) => {

    const { id } = req.params;

    const params = [id]

    try {

        const data = await notifyService.readNotifyList(params);

        res.send({
            status: 0,
            message: '阅读消息成功',
            data: data[0]
        })

    } catch (err) {
        console.log(err);
        next(new Error('READNOTIFYERROR'));
    }
}

/**
 * 删除消息列表
 */

export const deleteNotifyList = async (req, res, next) => {

    const { id } = req.params;


    const params = [id]

    try {

        const data = await notifyService.deleteNotify(params);
        res.send({
            status: 0,
            message: '删除消息列表成功',
            data: data[0]
        })
    } catch (err) {
        console.log(err);
        next(new Error('DELETENOTIFYERROR'));
    }
}

/**
 * 新增消息通知
 */
export const addNotify = async ({ user_id, type, to_id, message }) => {
    try {
        await notifyService.createNotify({ user_id, type, to_id, message });
    } catch (err) {
        console.error(err);
        next(new Error('NEWNOTIFYERROR'));
    }
}