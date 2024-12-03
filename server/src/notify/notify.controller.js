import * as notifyService from './notify.service.js';
import { PAGE_SIZE } from '../app/app.config.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.NOTIFY;

/**
 * 分页获取消息列表
 */
export const getNotifyList = async (req, res, next) => {

    // 当前页码
    const { current, size, userId } = req.body;

    // 偏移量
    const offset = (current - 1) * parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

    try {

        const notifyList = await notifyService.getNotifyList({userId, size, offset});

        // 总条数
        const total = await notifyService.getNotifyTotal(userId);

        res.send(result("获取消息列表成功", { current, size, list: notifyList, total }))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取消息列表失败", 500))
    }
}

/**
 * 阅读消息列表
 */

export const readNotifyList = async (req, res, next) => {

    const { id } = req.params;
    try {

        const data = await notifyService.readNotifyList({id});

        res.send(result("阅读消息成功", data[0]))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "阅读消息失败", 500))
    }
}

/**
 * 删除消息列表
 */

export const deleteNotifyList = async (req, res, next) => {

    const { id } = req.params;

    try {

        const data = await notifyService.deleteNotify({id});

        res.send(result("删除消息列表成功", data[0]))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "删除消息列表失败", 500))
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
        return errorResult(errorCode, "新增消息通知失败", 500);
    }
}