import express from 'express';
import * as configController from './config.controller.js';

const router = express.Router({
    prefixKey: '/config'
});

/**
 * 获取网站配置
 */
router.get('/config', configController.storeWebConfig);


/**
 * 更新访问量
 */
router.put('/config/addView', configController.addView)

/**
 * 导出路由
 */
export default router;