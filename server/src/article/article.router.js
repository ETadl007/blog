import express from 'express';
import * as articleController from './article.controller.js';
import * as likeControllerfrom from '../like/like.controller.js';

const router = express.Router({
    prefixKey: '/article'
});

/**
 * 获取文章列表
 */
router.get('/article/blogHomeGetArticleList/:current/:size',  articleController.getArticleList);

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
 * 导出路由
 */
export default router;