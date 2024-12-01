import express from 'express';
import * as CategoryController from './category.controller.js';
import { authGuard, needAdminAuthNotNeedSuper } from '../auth/auth.middleware.js';

const router = express.Router({
    prefixKey: '/category'
});

/**
 * 获取分类列表
 */
router.get('/category/getCategoryDictionary', CategoryController.getCategoryDictionary);

/**
 * 条件分页获取分类列表
 */
router.post('/category/getCategoryList', CategoryController.getCategoryList);

/**
 * 新增分类
 */
router.post('/category/add', authGuard, needAdminAuthNotNeedSuper, CategoryController.addCategory);

/**
 * 修改分类
 */
router.put('/category/update', authGuard, needAdminAuthNotNeedSuper, CategoryController.updateCategory);

/**
 * 删除分类
 */
router.post('/category/delete', authGuard, needAdminAuthNotNeedSuper, CategoryController.deleteCategory);

/**
 * 导出路由
 */
export default router;