import * as articleService from './article.service.js';
import { PAGE_SIZE } from '../app/app.config.js'
import { connecttion } from "../app/database/mysql.js"
import { createCategoryOrReturn, createArticleTagByArticleId, deleteArticleTag } from './article.common.js'

import { result, ERRORCODE, errorResult } from '../result/index.js'
const errorCode = ERRORCODE.ARTICLE;


/**
 *  分页获取文章 按照置顶和发布时间倒序排序
 */
export const blogHomeGetArticleList = async (req, res, next) => {

    // 当前页码
    let { current = 1, size } = req.params;

    // 每页内容数量
    const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

    // 偏移量
    const offset = (current - 1) * limit;

    try {
        // 分页获取文章 按照置顶和发布时间倒序排序
        const articleList = await articleService.blogArticleListService({ limit, offset });
        // 获取文章数量
        const articleCount = await articleService.blogArticleTotalService();

        res.send(result("获取文章列表成功", { current, size, list: articleList, total: articleCount }))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取文章列表失败", 500))
    }

}

/**
 *  获取前台时间轴列表
 */
export const getArticleTimeLineList = async (req, res, next) => {
    // 当前页码
    let { current, size } = req.params;

    // 每页内容数量
    const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

    // 偏移量
    const offset = (current - 1) * limit;

    try {
        // 获取前台时间轴列表
        const articleTimeLineList = await articleService.blogTimelineGetArticleList({ limit, offset });
        // 获取文章数量
        const articleCount = await articleService.blogArticleTotalService();
        res.send(result("获取文章时间轴列表成功", {
            current,
            size,
            list: articleTimeLineList,
            total: articleCount
        }))
    }
    catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取文章时间轴列表失败", 500));
    }
}

/**
 * 根据文章id获取文章详情
 */

export const getArticleDetail = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        const articleDetail = await articleService.blogArticleByIdService(id);
        // 如果文章不存在，直接返回失败响应
        if (!articleDetail) {
            return next(errorResult(errorCode, "获取文章详情失败", 500))
        }
        res.send(result("获取文章详情成功", articleDetail));

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取文章详情失败", 500))
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
            return next(errorResult(errorCode, "获取文章推荐失败", 500))
        }
        res.send(result("获取文章推荐成功", articleRecommend));

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取文章推荐失败", 500))
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

    try {
        const articleByTagId = await articleService.blogArticleByTagIdService({ id, limit, offset });
        const total = await articleService.blogArticleByTagIdTotalService(id);
        // 如果文章不存在，直接返回失败响应
        if (!articleByTagId.length) {
            return next(errorResult(errorCode, "标签获取文章列表失败", 500))
        }

        res.send(result("标签获取文章列表成功", { current, size, list: articleByTagId, total }));

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "标签获取文章列表失败", 500));
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
            return next(errorResult(errorCode, "分类获取文章列表失败", 500))
        }
        res.send(result("分类获取文章列表成功", { current, size, list: articleByCategoryId, total }))
    }
    catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "分类获取文章列表失败", 500))
    }
}

/**
 * 获取热门文章
 */

export const getArticleHot = async (req, res, next) => {
    try {

        const articleHot = await articleService.blogArticleHotService();

        res.send(result("获取热门文章成功", articleHot))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取热门文章失败", 500));
    }
}

/**
 * 根据文章内容搜索文章
 */

export const getArticleBySearch = async (req, res, next) => {
    const { content } = req.params;

    try {
        const articleBySearch = await articleService.blogArticleSearchService(content);

        res.send(result("按照内容搜索文章成功", articleBySearch))

    } catch (err) {
        console.log(err);;
        return next(errorResult(errorCode, "按照内容搜索文章失败", 500))
    }
}

/**
 * 文章增加阅读时长
 */

export const addReadingDuration = async (req, res, next) => {
    try {
        const { id, duration } = req.params

        if (!id && !duration) {
            return res.status(400).json({ error: '错误' });
        }

        const result = await articleService.addReadingDuration(id, duration);

        res.send(result("增加阅读时长成功", articleRecommend));

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "增加阅读时长失败", 500))
    }
}

/**
 * 根据标题获取文章是否已经存在
 */

export const getArticleInfoByTitle = async (req, res, next) => {

    try {
        const { id, article_title } = req.body

        const data = await articleService.getArticleInfoByTitle({ id, article_title })

        res.send(result("获取文章详情成功", data));

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取文章详情失败", 500))
    }
}

/**
 * 分页条件查询文章列表
 */
export const getArticleList = async (req, res, next) => {
    try {
        const { current, size } = req.body;

        const data = await articleService.getArticleList(req.body);

        res.send(result("查询文章成功", { current, size, list: data, total: result.length }))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "查询文章失败", 500))
    }
}

/**
 * 新增文章
 */
export const createArticle = async (req, res, next) => {

    // 用于管理事务的连接
    let connection;
    try {
        // 从连接池获取连接
        connection = await connecttion.promise().getConnection();
        // 开启事务 方便回滚
        await connection.beginTransaction();

        const { tagList, category, ...articleRest } = req.body

        // 若分类不存在先创建分类
        const { id, category_name } = category;

        articleRest.category_id = await createCategoryOrReturn(id, category_name);

        // 先创建文章，拿到文章的ID
        const newArticle = await articleService.createArticle(articleRest);

        // tag和标签进行关联
        const newArticleTagList = await createArticleTagByArticleId(newArticle.id, tagList);

        res.send(result("新增文章成功", { article: newArticle, articleTagList: newArticleTagList }))

        // 提交事务
        await connection.commit();
    } catch (err) {
        if (connection) await connection.rollback();
        console.log(err);
        return next(errorResult(errorCode, "新增文章失败", 500));
        // 回滚事务
    } finally {
        if (connection) connection.release();
    }
}

/**
 * 修改文章
 */
export const updateArticle = async (req, res, next) => {

    // 用于管理事务的连接
    let connection;
    try {
        // 从连接池获取连接
        connection = await connecttion.promise().getConnection();
        // 开启事务 方便回滚
        await connection.beginTransaction();

        const { tagList, category, ...articleRest } = req.body

        // 先删除这个文章与标签之前的关联
        await deleteArticleTag(articleRest.id);

        // 判断新的分类是新增的还是已经存在的 并且返回分类id
        articleRest.category_id = await createCategoryOrReturn(category.id, category.category_name);

        let newArticleTagList = await createArticleTagByArticleId(articleRest.id, tagList);

        let data = await articleService.updateArticle(articleRest);

        res.send(result("修改文章成功", { data, articleTagList: newArticleTagList }))

        // 提交事务
        await connection.commit();
    } catch (err) {
        if (connection) await connection.rollback();
        console.log(err);
        return next(errorResult(errorCode, "修改文章失败", 500));
        // 回滚事务
    } finally {
        if (connection) connection.release();
    }
}

/**
 * 删除文章
 */

export const deleteArticle = async (req, res, next) => {
    try {
        const { id, status } = req.params;

        const data = await articleService.deleteArticle(id, status);

        res.send(result("删除文章成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "删除文章失败", 500))
    }
}

/**
 * 修改文章置顶信息
 */
export const updateTop = async (req, res, next) => {
    try {
        const { id, is_top } = req.params;

        const data = await articleService.updateTop(id, is_top);

        res.send(result("修改文章置顶信息成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "修改文章置顶信息失败", 500))
    }
}

/**
 * 公开或隐藏文章
 */
export const toggleArticlePublic = async (req, res, next) => {
    try {
        const { id, status } = req.params;

        const data = await articleService.toggleArticlePublic(id, status);

        let message = Number(status) === 1 ? "隐藏文章" : "公开文章";
        res.send(result(message + "成功", data))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, message + "失败", 500))
    }
}

/**
 * 恢复文章
 */

export const revertArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await articleService.revertArticle(id);

        res.send(result("恢复文章成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "恢复文章失败", 500))
    }
}