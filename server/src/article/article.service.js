import { connecttion } from "../app/database/mysql.js"

/**
 *  获取文章列表
 */
export const blogArticleListService = async (params) => {

    let articleListSql = `
    SELECT 
        a.id, a.category_id, 
        a.createdAt,
        a.updatedAt, 
        a.author_id,
        a.article_title, 
        substr(a.article_content, 1, 50) AS article_content,
        a.article_cover, 
        a.is_top, 
        a.status, 
        a.type, 
        a.view_times, 
        a.article_description, 
        a.thumbs_up_times,
        a.reading_duration, 
        a.order AS article_order,
        JSON_ARRAYAGG(IFNULL(t.tag_name, '')) AS tagNameList
    FROM 
        blog_article a 
    LEFT JOIN
        blog_article_tag at ON a.id = at.article_id
    LEFT JOIN 
        blog_tag t ON at.tag_id = t.id
    GROUP BY 
        a.id 
    ORDER BY 
        a.is_top ASC, article_order ASC, a.createdAt DESC
    LIMIT ?
    OFFSET ?
    `;

    // 执行查询
    const [articleListResult] = await connecttion.promise().query(articleListSql, params);

    // 返回结果
    return articleListResult

}

/**
 *  根据文章id查询文章
 */

export const blogArticleExistService = async (id) => {
    const articleExistSql = `
    SELECT 
        id
    FROM 
        blog_article
    WHERE 
        id = ?
    `;

    // 执行查询
    const [articleExistResult] = await connecttion.promise().query(articleExistSql, id);

    // 返回结果
    return articleExistResult
}

/**
 *  获取前台时间轴列表
 */
export const blogTimelineGetArticleList = async (params) => {

    // SQL 语句
    let TimelineSql = `
    SELECT
        YEAR(createdAt) AS year,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', id,
                'article_title', article_title,
                'article_cover', article_cover,
                'createdAt', createdAt
            )
        ) AS articleList
    FROM 
        blog_article 
    GROUP BY 
        YEAR(createdAt)
    ORDER BY 
        MAX(createdAt) DESC 
    LIMIT ?
    OFFSET ?
    `;

    // 执行查询
    const [TimelineResult] = await connecttion.promise().query(TimelineSql, params);

    // 返回结果
    return TimelineResult

}

/**
 * 获取文章总数
 */
export const blogArticleTotalService = async (params) => {
    const [totalResult] = await connecttion.promise().query("SELECT COUNT(*) AS total FROM blog_article");
    return totalResult[0].total
}

/**
 * 增加文章的浏览次数
 */
const increaseViewTimes = async (id) => {
    try {
      const [result] = await connecttion.promise().query('UPDATE blog_article SET view_times = view_times + 1 WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('增加浏览次数时发生错误:', error);
      throw error;
    }
};

/**
 * 根据文章id获取文章详情
 */

export const blogArticleByIdService = async (params) => {
    let articleByIdSql = `
        SELECT
            a.id, a.category_id, 
            a.createdAt,
            a.updatedAt, 
            a.author_id,
            a.article_title, 
            substr(a.article_content, 1, 50) AS article_content,
            a.article_cover, 
            a.is_top, 
            a.status, 
            a.type, 
            a.view_times, 
            a.article_description, 
            a.thumbs_up_times,
            a.reading_duration, 
            a.order, 
            JSON_ARRAYAGG(IFNULL(t.id, '')) AS tagIdList,
            JSON_ARRAYAGG(IFNULL(t.tag_name, '')) AS tagNameList,
            u.username AS authorName,
            c.category_name AS categoryName
        fROM
            blog_article a
        LEFT JOIN
            blog_tag t ON a.id = t.id
        LEFT JOIN
            blog_category c ON a.id = c.id
        LEFT JOIN
            blog_user u ON a.id = u.id
        WHERE
            a.id = ?
        GROUP BY
            a.id
        `
    const [articleByIdResult] = await connecttion.promise().query(articleByIdSql, params);

    const article = articleByIdResult[0];

    if (!article) {
      return null; // 文章不存在，返回 null
    }

    // 增加文章的浏览次数
    await increaseViewTimes(params[0]);

    return article;
}

/**
 * 根据文章id获取推荐文章
 */

export const blogArticleRecommendService = async (id) => {
    const articleRecommendSql = `
    SELECT
        (
            SELECT JSON_OBJECT('id', id, 'article_title', article_title, 'article_cover', article_cover)
            FROM blog_article
            WHERE id < ?
            ORDER BY id DESC
            LIMIT 1
        ) AS previous,
        (
            SELECT JSON_OBJECT('id', id, 'article_title', article_title, 'article_cover', article_cover)
            FROM blog_article
            WHERE id > ?
            ORDER BY id ASC
            LIMIT 1
        ) AS next,
        (
            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'article_title', article_title, 'article_cover', article_cover, 'createdAt', createdAt))
            FROM blog_article
            WHERE id != ?
            ORDER BY createdAt DESC
            LIMIT 6
        ) AS recommend
    `;

    // 查询文章ID是否存在
    const [articleExistResult] = await connecttion.promise().query("SELECT * FROM blog_article WHERE id = ?", [id]);

    if (articleExistResult.length === 0) {
        return false;
    }

    const [articleRecommendResult] = await connecttion.promise().query(articleRecommendSql, [id, id, id]);

    // 处理“上一篇”或“下一篇”不存在的情况
    const { previous, next, recommend } = articleRecommendResult[0];

    // 如果previous为null，用当前文章填充
    if (!previous) {
        const currentArticle = await connecttion.promise().query("SELECT JSON_OBJECT('id', id, 'article_title', article_title, 'article_cover', article_cover) AS previous FROM blog_article WHERE id = ?", [id]);
        articleRecommendResult[0].previous = currentArticle[0][0]['previous'];
    }

    // 如果next为null，用当前文章填充（理论上这种情况不太可能发生，除非只有一篇文章）
    if (!next) {
        const currentArticle = await connecttion.promise().query("SELECT JSON_OBJECT('id', id, 'article_title', article_title, 'article_cover', article_cover) AS next FROM blog_article WHERE id = ?", [id]);
        articleRecommendResult[0].next = currentArticle[0][0]['next'];
    }


    return articleRecommendResult[0];
}

/**
 * 通过标签id 获取到文章列表
 */

export const blogArticleByTagIdService = async (params) => {
    const ArticleByTagIdSql = `
    SELECT 
        ba.createdAt,
        ba.article_title,
        ba.id,
        ba.article_cover
    FROM 
        blog_article_tag bat
    INNER JOIN 
        blog_article ba ON bat.article_id = ba.id
    WHERE 
        bat.tag_id = ?

    ORDER BY
        ba.createdAt DESC
    LIMIT ?
    OFFSET ?
    `;

    const [ArticleByTagIdResult] = await connecttion.promise().query(ArticleByTagIdSql, params);
    return ArticleByTagIdResult
}

/**
 * 通过标签id 获取到文章总数
 */

export const blogArticleByTagIdTotalService = async (id) => {
    const ArticleByTagIdTotalSql = `
        SELECT 
            COUNT(*) AS total_count
        FROM
            blog_article a
        JOIN 
            blog_tag t ON t.id = a.id
        WHERE
            t.id = ?
    `;
    const [ArticleByTagIdTotalResult] = await connecttion.promise().query(ArticleByTagIdTotalSql, id);
    return ArticleByTagIdTotalResult[0].total_count
}

/**
 * 根据分类id获取该标签下的文章
 */

export const blogArticleByCategoryIdService = async (params) => {
    const ArticleByCategoryIdSql = `
    SELECT 
        ba.createdAt,
        ba.article_title,
        ba.id,
        ba.article_cover
    FROM 
        blog_article ba 
    INNER JOIN
        blog_category c ON c.id = ba.category_id
    WHERE
        c.id = ?
        
    ORDER BY
        ba.createdAt DESC
    LIMIT ?
    OFFSET ?
    `;
    const [ArticleByCategoryIdResult] = await connecttion.promise().query(ArticleByCategoryIdSql, params);
    return ArticleByCategoryIdResult
}

/**
 * 根据分类id获取该标签下的文章总数
 */

export const blogArticleByCategoryIdTotalService = async (id) => {
    const ArticleByCategoryIdTotalSql = `
        SELECT 
            COUNT(*) AS total_count
        FROM
            blog_article a  
        INNER JOIN
            blog_category c ON c.id = a.category_id
        WHERE
            c.id = ?    
    `;

    const [ArticleByCategoryIdTotalResult] = await connecttion.promise().query(ArticleByCategoryIdTotalSql, id);
    return ArticleByCategoryIdTotalResult[0].total_count
}

/**
 * 获取热门文章
 */

export const blogArticleHotService = async () => {
    const ArticleHotSql = `
    SELECT 
        id,
        article_title,
        view_times
    FROM 
        blog_article
    ORDER BY
        view_times DESC
    LIMIT 5
    `;
    const [ArticleHotResult] = await connecttion.promise().query(ArticleHotSql);
    return ArticleHotResult
}

/**
 * 根据文章内容搜索文章
 */

export const blogArticleSearchService = async (content) => {
    const ArticleSearchSql = `
    SELECT 
        id,
        article_title,
        article_content,
        view_times
    FROM 
        blog_article
    WHERE
        article_content LIKE CONCAT('%', ?, '%') AND status = 1
    ORDER BY
        view_times DESC
        
    `;

    const [ArticleSearchResult] = await connecttion.promise().query(ArticleSearchSql, content);
    return ArticleSearchResult
}

/**
 * 文章点赞
 */
export const blogArticleThumbsUpService = async (id) => {
    const ArticleThumbsUpSql = `
    UPDATE 
        blog_article
    SET 
        thumbs_up_times = thumbs_up_times + 1
    WHERE
        id = ?
    `;
    const [ArticleThumbsUpResult] = await connecttion.promise().query(ArticleThumbsUpSql, id);

    return ArticleThumbsUpResult.affectedRows > 0 ? true : false;
}

/**
 * 取消点赞
 */
export const blogArticleCancelThumbsUpService = async (id) => {
    const ArticleCancelThumbsUpSql = `
    UPDATE 
        blog_article
    SET 
        thumbs_up_times = thumbs_up_times - 1
    WHERE
        id = ?
    `;
    const [ArticleCancelThumbsUpResult] = await connecttion.promise().query(ArticleCancelThumbsUpSql, id);
    return ArticleCancelThumbsUpResult.affectedRows > 0 ? true : false;
}

/**
 * 文章增加阅读时长
 */

export const addReadingDuration = async (id, duration) => {
    const addReadingDurationSql = `
    UPDATE
        blog_article
    SET
        reading_duration = reading_duration + ?
    WHERE
        id = ?
    
    `;

    const rows = blogArticleExistService(id)

    if (rows) {
        const [result] = await connecttion.promise().query(addReadingDurationSql, [duration, id]);
        return result.affectedRows > 0;
    }

    return false
}