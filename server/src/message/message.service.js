import { connecttion } from "../app/database/mysql.js";
import { getIsLikeByIdAndType } from "../like/like.service.js"


/**
 * 获取留言列表
 */

export const getMessageList = async ({limit, offset, user_id}) => {

    const messageSql = `
    SELECT 
        m.id,
        m.message,
        m.tag,
        m.createdAt,        
        m.updatedAt,
        m.user_id,
        m.color,
        m.font_size,
        m.font_weight,
        m.bg_color,
        m.bg_url,
        m.like_times,
        COALESCE(u.avatar, "") AS avatar,
        COALESCE(u.username, m.nick_name) AS nick_name,
        COUNT(c.for_id) AS comment_total
    FROM 
        blog_message m 
    LEFT JOIN 
        blog_user u ON m.user_id = u.id
    LEFT JOIN (
        SELECT for_id
        FROM blog_comment
        WHERE type = 3
    ) c ON m.id = c.for_id
    GROUP BY m.id
    LIMIT ?
    OFFSET ?
    `;
    const [data] = await connecttion.promise().query(messageSql, [limit, offset]);
    
    // 判断当前登录的用户是否以点赞
    const isLikePromises = data.map(async (item) => {
        return getIsLikeByIdAndType({ for_id: item.id, type: 3, user_id: user_id || item.ip });
    });

    const likeResults = await Promise.all(isLikePromises);
    data.forEach((item, index) => {
        item.is_like = likeResults[index];
    });

    return data;
}

/**
 * 获取热门标签
 */

export const getMessageHotTags = async () => {

    const messageHotSql = `
    SELECT 
        tag, 
        COUNT(tag) AS count
    FROM 
        blog_message
    WHERE 
        tag IS NOT NULL
    GROUP BY 
        tag
    ORDER BY 
        count DESC
    LIMIT 10;`;
    const [data] = await connecttion.promise().query(messageHotSql);
    return data;
}

/**
 * 获取留言总数
 */

export const getMessageTotal = async () => {

    const messageTotalSql = `
    SELECT 
        COUNT(*) AS total
    FROM 
        blog_message;`;
    const [data] = await connecttion.promise().query(messageTotalSql);
    return data[0].total;
}

/**
 * 发布留言
 */

export const addMessage = async ({message, nick_name, user_id, color, font_size, font_weight, bg_color, bg_url, tag, createdAt}) => {

    const createMessageSql = `
    INSERT INTO 
        blog_message (message, nick_name, user_id, color, font_size, font_weight, bg_color, bg_url, tag, createdAt)
    VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const [data] = await connecttion.promise().query(createMessageSql, [message, nick_name, user_id, color, font_size, font_weight, bg_color, bg_url, tag, createdAt]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 删除留言
 */
export const deleteMessage = async (id) => {

    const deleteMessageSql = `
    DELETE FROM 
        blog_message
    WHERE 
        id = ?;`;
    const [data] = await connecttion.promise().query(deleteMessageSql, [id]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 编辑留言
 */
export const updateMessage = async (params) => {

    const updateMessageSql = `
    UPDATE 
        blog_message
    SET 
        message = ?,
        color = ?,
        font_size = ?,
        font_weight = ?,
        bg_color = ?,
        bg_url = ?,
        tag = ?
    WHERE 
        id = ?;`;
    const [data] = await connecttion.promise().query(updateMessageSql, params);
    return data.affectedRows > 0 ? true : false;
}