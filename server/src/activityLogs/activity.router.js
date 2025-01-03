import express from 'express';
import * as activityController from './activity.controller.js';
import { authGuard } from '../auth/auth.middleware.js';

const router = express.Router({
    prefixKey: '/activity'
});

/**
 * 获取最新动态列表
 */
router.get('/activity/latest', authGuard, activityController.getActivityLogs);

/**
 * 新增动态
 */
router.post('/activity/add',authGuard, activityController.addActivityLog);

/**
 * 导出路由
 */
export default router;