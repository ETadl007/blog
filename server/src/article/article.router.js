import express from 'express';
import * as articleController from './article.controller.js';
import * as likeControllerfrom from '../like/like.controller.js';
import { authGuard, needAdminAuthNotNeedSuper } from '../auth/auth.middleware.js';
import { verifyArticleParam, createJudgeTitleExist, updateJudgeTitleExist, verifyTopParam, verifyDelParam } from './article.middleware.js';

const router = express.Router({
    prefixKey: '/article'
});

/**
 * 新增文章
 */
router.post('/article/add', authGuard, needAdminAuthNotNeedSuper, verifyArticleParam, createJudgeTitleExist, articleController.createArticle);

/**
 * 修改文章
 */
router.put('/article/update', authGuard, needAdminAuthNotNeedSuper, verifyArticleParam, updateJudgeTitleExist, articleController.updateArticle)

/**
 * 删除文章
 */
router.delete('/article/delete/:id/:status', authGuard, needAdminAuthNotNeedSuper, verifyDelParam, articleController.deleteArticle)

/**
 * 修改文章置顶信息
 */
router.put('/article/updateTop/:id/:is_top', authGuard, needAdminAuthNotNeedSuper, verifyTopParam, articleController.updateTop)

/**
 * 切换文章私密性
 */
router.put('/article/isPublic/:id/:status', authGuard, needAdminAuthNotNeedSuper, articleController.toggleArticlePublic)

/**
 * 恢复文章
 */
router.put('/article/revert/:id', authGuard, needAdminAuthNotNeedSuper, articleController.revertArticle)


/**
 * 获取文章列表
 */
router.get('/article/blogHomeGetArticleList/:current/:size',  articleController.blogHomeGetArticleList);

/**
 * 获取前台时间轴列表
 */
router.get('/article/blogTimelineGetArticleList/:current/:size', articleController.getArticleTimeLineList);

/**
 * 根据文章id获取文章详情
 */
router.get('/article/getArticleById/:id', articleController.getArticleDetail);

/**
 * 根据文章id获取推荐文章
 */

router.get('/article/getRecommendArticleById/:id', articleController.getArticleRecommend);

/**
 * 通过标签id 获取到文章列表
 */

router.post('/article/getArticleListByTagId', articleController.getArticleByTagId);

/**
 * 通过分类id 获取到文章列表
 */

router.post('/article/getArticleListByCategoryId', articleController.getArticleByCategoryId);


/**
 * 获取热门文章
 */

router.get('/article/getHotArticle', articleController.getArticleHot);

/**
 * 文章搜索
 */

router.get('/article/getArticleListByContent/:content', articleController.getArticleBySearch);

/**
 * 文章点赞
 */
router.post('/like/addLike', likeControllerfrom.addLike)


/**
 * 取消点赞
 */
router.post('/like/cancelLike', likeControllerfrom.cancelLike)

/**
 *文章增加阅读时长 
 */
router.put('/article/addReadingDuration/:id/:duration', articleController.addReadingDuration)


/**
 * 根据文章标题 和 id 判断文章标题是否重复了
 */
router.post('/article/titleExist', articleController.getArticleInfoByTitle)


/**
 * 条件分页查询文章列表
 */
router.post('/article/getArticleList', authGuard, articleController.getArticleList)

/**
 * 导出路由
 */
export default router;