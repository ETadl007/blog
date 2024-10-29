import express from 'express';
import * as linksController from './links.controller.js';
import { authGuard } from '../auth/auth.middleware.js'

const router = express.Router({
    prefixKey: '/links'
});

/**
 * 获取友链列表
 */
router.post('/links/getLinksList', linksController.getTalkList);


/**
 * 新增友链
 */
router.post('/links/add', authGuard, linksController.addOrUpdateLinks);

/**
 * 修改友链
 */
router.post('/links/frontUpdate', authGuard, linksController.addOrUpdateLinks);


/**
 * 导出路由
 */
export default router;