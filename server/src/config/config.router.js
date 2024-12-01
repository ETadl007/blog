import express from 'express';
import * as configController from './config.controller.js';
import { authGuard, needAdminAuth } from '../auth/auth.middleware.js';
import { TimesLimiter } from '../app/app.middleware.js'

const router = express.Router({
    prefixKey: '/config'
});

/**
 * 修改网站配置
 */
router.post('/config/update', authGuard, needAdminAuth, configController.updateConfig);

/**
 * 获取网站配置
 */
router.get('/config', configController.storeWebConfig);


/**
 * 更新访问量
 */
router.put('/config/addView', TimesLimiter({
    prefixKey: "config/addView",
    message: "小伙子你在刷访问量，被我发现了！",
    limit: 100,
    windowMs: 60 * 1000,

}), configController.addView)

/**
 * 导出路由
 */
export default router;