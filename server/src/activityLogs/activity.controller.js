import * as activityLogService from '../activityLogs/activity.service.js';

import { result, ERRORCODE, errorResult } from '../result/index.js'
const errorCode = ERRORCODE.ACTIVITY;

/**
 *  后台获取活动日志列表
 */
export const getActivityLogs = async (req, res, next) => {
    try {
        const activityLogs = await activityLogService.getActivityLogs();
        res.send(result("获取最新动态成功", activityLogs));
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取最新动态失败", 500))
    }
}

/**
 * 新增活动日志
 */
export const addActivityLog = async ({actor_id, action, target_type, target_id, target_name, changes, metadata}) => {
    try {
        await activityLogService.addActivityLog({actor_id, action, target_type, target_id, target_name, changes, metadata});
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "新增动态失败", 500))
    }
}