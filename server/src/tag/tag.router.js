import express from 'express';
import * as tagController from './tag.controller.js';

const router = express.Router({
    prefixKey: '/tag'
});

/**
 * 获取网站配置
 */
router.get('/tag/getTagDictionary', tagController.storeTag);

/**
 * 导出路由
 */
export default router;