import express from 'express';
import * as tagController from './tag.controller.js';
import { authGuard, needAdminAuth } from '../auth/auth.middleware.js';

import { verifyTag, verifyDeleteTags } from './tag.midddleware.js'

const router = express.Router({
    prefixKey: '/tag'
});

/**
 * 获取标签列表
 */
router.get('/tag/getTagDictionary', tagController.getTagDictionary);
/**
 * 分页获取标签字典
 */
router.post('/tag/getTagList', authGuard, tagController.getTagList);

/**
 * 删除标签
 */
router.post('/tag/delete', authGuard, needAdminAuth, verifyDeleteTags, tagController.deleteTag);

/**
 * 添加标签
 */
router.post('/tag/add', authGuard, needAdminAuth, verifyTag, tagController.addTag);

/**
 * 修改标签
 */
router.put('/tag/update', authGuard, needAdminAuth, verifyTag, tagController.updateTag);

/**
 * 导出路由
 */
export default router;