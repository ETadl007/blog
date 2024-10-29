import express from 'express';
import * as notifyController from './notify.controller.js';
import { authGuard } from '../auth/auth.middleware.js'

const router = express.Router({
    prefixKey: '/notify'
});

/**
 * 分页获取消息列表
 */
router.post('/notify/getNotifyList', notifyController.getNotifyList);

/**
 * 阅读消息列表
 */

router.put('/notify/update/:id', authGuard, notifyController.readNotifyList);

/**
 * 删除消息列表
 */

router.delete('/notify/delete/:id', authGuard, notifyController.deleteNotifyList);

/**
 * 导出路由
 */
export default router;