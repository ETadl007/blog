import express from 'express';
import * as talkController from './talk.controller.js';

const router = express.Router({
    prefixKey: '/talk'
});

/**
 * 获取说说列表
 */
router.post('/api/talk/blogGetTalkList', talkController.getTalkList);

/**
 * 导出路由
 */
export default router;