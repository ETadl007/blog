import { connecttion } from "../app/database/mysql.js";

/**
 * 获取当前用户对当前文章/说说/留言 是否点赞
 */


export const isLike = async (params) => {
    const statement = `
        SELECT 
            *
        FROM 
            blog_like
        WHERE 
            user_id = ? AND type = ? AND for_id = ?
    `;
        
    const [data] = await connecttion.promise().query(statement, params);
    return data[0] ? true : false;
}

/**
 * 点赞
 */
export const addLike = async ({ for_id, type, user_id }) => {  
    
    const statement = `
        INSERT INTO blog_like (type, for_id, user_id)
        VALUES (?,?,?)
    `;
    const [data] = await connecttion.promise().query(statement, [type, for_id, user_id]);

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
    }else if (type == 2) {
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
        return data.affectedRows > 0;
        
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
        return data.affectedRows > 0;
        
    }else if (type == 4){
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
        return data.affectedRows > 0;
    }
    return data.affectedRows === 1;
}

/**
 * 取消点赞
 */
export const cancelLike = async ({ for_id, type, user_id }) => {
    console.log();
    
    
    const statement = `
    DELETE FROM blog_like
    WHERE type = ? AND for_id = ? AND user_id = ?
    `;

    const [data] = await connecttion.promise().query(statement, [type, for_id, user_id]);

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
    }else if (type == 2) {
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
        return data.affectedRows > 0;
        
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
        return data.affectedRows > 0;
        
    }
    return data.affectedRows === 1;
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
    
        return rows.length > 0;
      } catch (error) {
        console.error('获取点赞状态时发生错误:', error);
        throw error;
      }
}