import express from 'express';
import * as CategoryController from './category.controller.js';

const router = express.Router({
    prefixKey: '/category'
});

/**
 * 获取文章列表
 */
router.get('/category/getCategoryDictionary', CategoryController.getCategoryList);

/**
 * 导出路由
 */
export default router;