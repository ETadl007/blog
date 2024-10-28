import * as articleService from './article.service.js';
import { PAGE_SIZE } from '../app/app.config.js'

/**
 *  获取文章列表
 */
export const getArticleList = async (req, res, next) => {

    // 当前页码
    let { current = 1, size } = req.params;

    // 每页内容数量
    const limit = parseInt(PAGE_SIZE, 10) || 10;

    // 偏移量
    const offset = (current - 1) * limit;

    const params = [limit, offset]

    try {
        // 获取文章列表
        const articleList = await articleService.blogArticleListService(params);
        // 获取文章数量
        const articleCount = await articleService.blogArticleTotalService();
        res.status(200).send({
            status: 0,
            message: "获取文章列表成功",
            data: {
                current,
                size,
                list: articleList,
                total: articleCount
            }
        });

    } catch (err) {
        console.log(err);
        next(new Error('GETARTICLELISTERROR'));
    }

}

/**
 *  获取前台时间轴列表
 */
export const getArticleTimeLineList = async (req, res, next) => {
    // 当前页码
    let { current = 1, size } = req.params;

    // 每页内容数量
    const limit = parseInt(PAGE_SIZE, 10) || 10;

    // 偏移量
    const offset = (current - 1) * limit;

    const params = [limit, offset]

    try {
        // 获取前台时间轴列表
        const articleTimeLineList = await articleService.blogTimelineGetArticleList(params);
        // 获取文章数量
        const articleCount = await articleService.blogArticleTotalService();
        res.status(200).send({
            status: 0,
            message: "获取文章时间轴列表成功",
            data: {
                current,
                size,
                list: articleTimeLineList,
                total: articleCount
            }
        });
    }
    catch (err) {
        console.log(err);
        next(new Error('GETARTICLETIMELINELISTERROR'));
    }
}

/**
 * 根据文章id获取文章详情
 */

export const getArticleDetail = async (req, res, next) => {
    const { id } = req.params;
    
    try {
        const articleDetail = await articleService.blogArticleByIdService(id);
        // 如果文章不存在，直接返回失败响应
        if (!articleDetail) {
            return res.status(500).send({
                status: 1,
                message: "获取文章详情失败"
            });
        }
        res.status(200).send({
            status: 0,
            message: "获取文章详情成功",
            data: articleDetail

        });

    } catch (err) {
        console.log(err);
        next(new Error('GETARTICLEDETAILERROR'));
    }
}

/**
 * 根据文章id获取推荐文章
 */

export const getArticleRecommend = async (req, res, next) => {
    const { id } = req.params;
    const articleRecommend = await articleService.blogArticleRecommendService(id);
    try {
        // 如果文章推荐不存在，直接返回失败响应
        if (!articleRecommend) {
            return res.status(500).send({
                status: 1,
                message: "获取文章推荐失败"
            });
        }
        res.status(200).send({
            status: 0,
            message: "获取文章推荐成功",
            data: articleRecommend

        });

    } catch (err) {
        console.log(err);
        next(new Error('GETARTICLERECOMMENDERROR'));
    }
}

/**
 * 通过标签id 获取到文章列表
 */

export const getArticleByTagId = async (req, res, next) => {
    // 当前页码
    let { current = 1, size, id } = req.body;

    // 每页内容数量
    const limit = parseInt(PAGE_SIZE, 10) || 10;

    // 偏移量
    const offset = (current - 1) * limit;

    const params = [id, limit, offset]

    try {
        const articleByTagId = await articleService.blogArticleByTagIdService(params);
        const total = await articleService.blogArticleByTagIdTotalService(id);
        // 如果文章不存在，直接返回失败响应
        if (!articleByTagId.length) {
            return res.status(400).send({
                status: 1,
                message: "标签获取文章列表失败"
            });
        }

        res.status(200).send({
            status: 0,
            message: "标签获取文章列表成功",
            data: {
                current,
                size,
                list: articleByTagId,
                total
            }
        })

    } catch (err) {
        console.log(err);
        next(new Error('GETARTICLEBYTAGIDERROR'));
    }
}

/**
 *  根据分类id获取该标签下的文章
 */

export const getArticleByCategoryId = async (req, res, next) => {
    // 当前页码
    let { current = 1, size, id } = req.body;

    // 每页内容数量
    const limit = parseInt(PAGE_SIZE, 10) || 6;

    // 偏移量
    const offset = (current - 1) * limit;

    const params = [id, limit, offset]
    
    try {
        const articleByCategoryId = await articleService.blogArticleByCategoryIdService(params);
        const total = await articleService.blogArticleByCategoryIdTotalService(id);

        // 如果文章不存在，直接返回失败响应
        if (!articleByCategoryId.length) {
            return res.status(400).send({
                status: 1,
                message: "分类获取文章列表失败"
            });
        }
        res.status(200).send({
            status: 0,
            message: "分类获取文章列表成功",
            data: {
                current,
                size,
                list: articleByCategoryId,
                total
            }
        })
    }
    catch (err) {
        console.log(err);
        next(new Error('GETARTICLEBYCATEGORYIDERROR'));
    }
}

/**
 * 获取热门文章
 */

export const getArticleHot = async (req, res, next) => {
    try {

        const articleHot = await articleService.blogArticleHotService();
        
        res.send({
            status: 0,
            message: "获取热门文章成功",
            data: articleHot
        })

    } catch (err) {
        console.log(err);
        next(new Error('GETARTICLEHOTERROR'));
    }
}

/**
 * 根据文章内容搜索文章
 */

export const getArticleBySearch = async (req, res, next) => {
    const { content } = req.params;

    try {
        const articleBySearch = await articleService.blogArticleSearchService(content);
        res.send({
            status: 0,
            message: "按照内容搜索文章成功",
            data: articleBySearch
        })
    }catch (err) {
        console.log(err);
        next(new Error('GETARTICLEBYSEARCHERROR'));
    }
}

 /**
  * 文章增加阅读时长
  */

 export const addReadingDuration = async (req, res, next) => {
    try {
        const { id, duration } = req.params

        if (!id && !duration){
            return res.status(400).json({ error: '错误' });
        }

        const result = await articleService.addReadingDuration(id, duration);

        res.send({
            status: 0,
            msg: '增加阅读时长成功',
            data: result
        })

    } catch (err) {
        console.log(err);
        next(new Error('ADDREADINGDURATIONERROR'))
    }
 }