import express from 'express';
import * as headerController from './header.controller.js';
import { authGuard, needAdminAuth } from '../auth/auth.middleware.js';

const router = express.Router({
    prefixKey: '/pageHeader'
});

/**
 * 获取所有背景图
 */
router.get("/pageHeader/getAll", headerController.getAllHeader);

/**
 *  新增/修改背景图
 */
router.post("/pageHeader/addOrUpdate", authGuard, needAdminAuth, headerController.addOrUpdateHeader);

/**
 *根据id删除背景 
 */
router.post("/pageHeader/delete", authGuard, needAdminAuth, headerController.deleteHeaderById);

/**
 * 导出路由
 */
export default router;