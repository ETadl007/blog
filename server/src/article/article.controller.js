import * as articleService from './article.service.js';
import { PAGE_SIZE } from '../app/app.config.js'
import { connecttion } from "../app/database/mysql.js"
import { createCategoryOrReturn, createArticleTagByArticleId, deleteArticleTag } from './article.common.js'

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
            return res.status(400).send({
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
    } catch (err) {
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

        if (!id && !duration) {
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

/**
 * 根据标题获取文章是否已经存在
 */

export const getArticleInfoByTitle = async (req, res, next) => {

    try {
        const { id, article_title } = req.body
        const result = await articleService.getArticleInfoByTitle({ id, article_title })
        res.send({
            status: 0,
            msg: '文章查询结果',
            data: result
        })

    } catch (err) {
        console.log(err);
        next(new Error('GETARTICLEDETAILERROR'));
    }
}

/**
 * 分页条件查询文章列表
 */
export const getArticleList = async (req, res, next) => {
    try {
        const { current, size } = req.body;
        
        const result = await articleService.getArticleList(req.body);
        res.send({
            status: 0,
            message: '查询文章成功',
            data: {
                current,
                size,
                list: result,
                total: result.length
            }
        })

    } catch (err) {
        console.log(err);
        next(new Error('GETARTICLELISTERROR'));
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

        res.send({
            status: 0,
            message: '新增文章成功',
            data: {
                article: newArticle,
                articleTagList: newArticleTagList,
            }
        })

        // 提交事务
        await connection.commit();
    } catch (err) {
        if (connection) await connection.rollback();
        console.log(err);
        next(new Error('CREATEARTICLEERROR'));
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

        let result = await articleService.updateArticle(articleRest);

        res.send({
            status: 0,
            message: '修改文章成功',
            data: result
        })

        // 提交事务
        await connection.commit();
    } catch (err) {
        if (connection) await connection.rollback();
        console.log(err);
        next(new Error('UPDATEARTICLEERROR'));
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

        const result = await articleService.deleteArticle(id, status);
        res.send({
            status: 0,
            message: '删除文章成功',
            data: result
        })
    } catch (err) {
        console.log(err);
        next(new Error('DELETEARTICLEERROR'));
    }
}

/**
 * 修改文章置顶信息
 */
export const updateTop = async (req, res, next) => {
    try {
        const { id, is_top } = req.params;

        const result = await articleService.updateTop(id, is_top);
        res.send({
            status: 0,
            message: '修改文章置顶信息成功',
            data: result
        })
    } catch (err) {
        console.log(err);
        next(new Error('UPDATEARTICLETOPERROR'));
    }
}

/**
 * 公开或隐藏文章
 */
export const toggleArticlePublic = async (req, res, next) => {
    try {
        const { id, status } = req.params;

        const result = await articleService.toggleArticlePublic(id, status);
        res.send({
            status: 0,
            message: '公开或隐藏文章成功',
            data: result
        })
    } catch (err) {
        console.log(err);
        next(new Error('TOGGLEARTICLEPUBLICERROR'));
    }
}

/**
 * 恢复文章
 */

export const revertArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await articleService.revertArticle(id);
        res.send({
            status: 0,
            message: '恢复文章成功',
            data: result
        })
    } catch (err) {
        console.log(err);
        next(new Error('RECOVERARTICLEERROR'));
    }
}