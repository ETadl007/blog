import express from 'express';
import * as talkController from './talk.controller.js';
import { authGuard, needAdminAuthNotNeedSuper } from '../auth/auth.middleware.js';


const router = express.Router({
    prefixKey: '/talk'
});

/**
 * 前台获取说说列表
 */
router.post('/talk/blogGetTalkList', talkController.blogGetTalkList);

/**
 * 后台获取说说列表
 */
router.post('/talk/getTalkList', talkController.getTalkList);

/**
 * 发布说说
 */
router.post('/talk/publishTalk', authGuard, needAdminAuthNotNeedSuper, talkController.publishTalk);

/**
 * 修改说说
 */
router.put("/updateTalk", authGuard, needAdminAuthNotNeedSuper, talkController.updateTalk);

/**
 * 根据id 获取说说详情
 */
router.get('/talk/getTalkById/:id', talkController.getTalkById);

/**
 * 切换置顶状态
 */
router.put('/talk/toggleTop/:id/:is_top', authGuard, needAdminAuthNotNeedSuper, talkController.toggleTop);

/**
 * 恢复说说
 */
router.put('/talk/revertTalk/:id', authGuard, needAdminAuthNotNeedSuper, talkController.recoverTalk);

/**
 * 删除说说
 */
router.delete('/talk/deleteTalkById/:id/:status', authGuard, needAdminAuthNotNeedSuper, talkController.deleteTalk);

/**
 * 公开/私密说说
 */
router.put('/talk/togglePublic/:id/:status', authGuard, needAdminAuthNotNeedSuper, talkController.togglePublic);

/**
 * 导出路由
 */
export default router;