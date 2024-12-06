import { connecttion } from "../app/database/mysql.js";

import moment from 'moment';

/**
 * 点赞
 */
export const addLike = async ({ for_id, type, user_id, ip }) => {

    // 手动设置时间
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    const statement = `
        INSERT INTO blog_like (type, for_id, user_id, createdAt, updatedAt, ip)
        VALUES (?,?,?,?,?,?)
    `;
    const [data] = await connecttion.promise().query(statement, [type, for_id, user_id, currentTime, currentTime, ip]);

    if (type == 1) {
        // 文章
        const ArticleThumbsUpSql = `
        UPDATE 
            blog_article
        SET 
            thumbs_up_times = thumbs_up_times + 1
        WHERE
            id = ?
        `;
        const [ArticleThumbsUpResult] = await connecttion.promise().query(ArticleThumbsUpSql, [for_id]);

        return ArticleThumbsUpResult.affectedRows > 0 ? true : false;
    } else if (type == 2) {
        // 说说
        const talkSql = `
        UPDATE 
            blog_talk 
        SET 
            like_times = like_times + 1 
        WHERE 
            id = ?
        `;
        const [data] = await connecttion.promise().query(talkSql, [for_id]);
        return data.affectedRows > 0 ? true : false;

    } else if (type == 3) {
        // 留言
        const addMessageLikeSql = `
        UPDATE 
            blog_message 
        SET 
            like_times = like_times + 1 
        WHERE 
            id = ?
        `;
        const [data] = await connecttion.promise().query(addMessageLikeSql, [for_id]);
        return data.affectedRows > 0 ? true : false;

    } else if (type == 4) {
        // 评论
        const addMessageLikeSql = `
        UPDATE 
            blog_comment 
        SET 
            thumbs_up = thumbs_up + 1 
        WHERE 
            id = ?
        `;
        const [data] = await connecttion.promise().query(addMessageLikeSql, [for_id]);
        return data.affectedRows > 0 ? true : false;
    }
    return data.affectedRows > 0 ? true : false;
}

/**
 * 取消点赞
 */
export const cancelLike = async ({ for_id, type, user_id, ip }) => {
    try {
        const params = []
        const wherecase = []

        params.push(for_id)
        wherecase.push('for_id = ?')

        params.push(type)
        wherecase.push('type = ?')

        if (user_id) {
            params.push(user_id)
            wherecase.push('user_id = ?')
        }

        if (ip) {
            params.push(ip)
            wherecase.push('ip = ?')
        }
        const where = wherecase.join(' AND ')

        const statement = `
        DELETE FROM 
            blog_like
        WHERE 
            ${where}
        `;
        
        const [data] = await connecttion.promise().query(statement, params);
        
        if (type == 1) {
            // 文章
            const ArticleCancelThumbsUpSql = `
            UPDATE 
                blog_article
            SET 
                thumbs_up_times = thumbs_up_times - 1
            WHERE
                id = ?
            `;
            const [ArticleCancelThumbsUpResult] = await connecttion.promise().query(ArticleCancelThumbsUpSql, [for_id]);
            return ArticleCancelThumbsUpResult.affectedRows > 0 ? true : false;
        } else if (type == 2) {
            // 说说
            const talkSql = `
            UPDATE 
                blog_talk 
            SET 
                like_times = like_times - 1     
            WHERE 
                id = ?
            `;
            const [data] = await connecttion.promise().query(talkSql, [for_id]);
            return data.affectedRows > 0 ? true : false;

        } else if (type == 3) {
            // 留言
            const addMessageCancelLikeSql = `
            UPDATE 
                blog_message 
            SET 
                like_times = like_times - 1 
            WHERE 
                id = ?
            `;
            const [data] = await connecttion.promise().query(addMessageCancelLikeSql, [for_id]);
            return data.affectedRows > 0 ? true : false;

        }
        return data.affectedRows > 0 ? true : false;
    } catch (err) {
        console.error('取消点赞时发生错误:', err);
        throw err;
    }


}


/**
 * 获取当前用户对当前文章/说说/留言 是否点赞
 */

export const getIsLikeByIdAndType = async ({ for_id, type, user_id }) => {

    try {

        const getIsLikeByIdAndTypeSql = `
        SELECT
            *
        FROM
            blog_like
        WHERE
            for_id = ? AND type = ? AND user_id = ?
        `;

        const [rows] = await connecttion.promise().query(getIsLikeByIdAndTypeSql, [for_id, type, user_id]);
        
        return rows.length ? true : false;
    } catch (err) {
        console.error('获取点赞状态时发生错误:', err);
        throw err;
    }
}

/**
 * 获取当前ip对当前文章/说说/留言 是否点赞
 */
export const getIsLikeByIpAndType = async ({ for_id, type, ip }) => {
    try {
        const getIsLikeByIpAndTypeSql = `
        SELECT
            *
        FROM
            blog_like
        WHERE
            for_id = ? AND type = ? AND ip = ?
        `;

        const [rows] = await connecttion.promise().query(getIsLikeByIpAndTypeSql, [for_id, type, ip]);

        return rows.length ? true : false;
    } catch (err) {
        console.error('获取点赞状态时发生错误:', err);
        throw err;
    }
}

/**
 * 判断文章/说说/留言 是否存在
 */

export const blogLikeExists = async ({ likeType }) => {

    let table;
    switch (likeType) {
        case 'article':
            table = 'blog_article';
            break;
        case 'talk':
            table = 'blog_talk';
            break;
        case 'message':
            table = 'blog_message';
            break;
        case 'comment':
            table = 'blog_comment';
            break;
        default:
            throw new Error('Invalid type');
    }

    const sql = `
    SELECT
        *
    FROM
        ${table}
    `
    // 执行查询
    const [articleExistResult] = await connecttion.promise().query(sql);

    // 返回结果
    return articleExistResult.length > 0;
}