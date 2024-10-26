import { connecttion } from "../app/database/mysql.js";
import { getIsLikeByIdAndType } from '../like/like.service.js'

/**
 * 获取说说列表
 */

export const getTalkList = async ({ limit, offset, user_id }) => {

    try {
        const talkSql = `
    SELECT 
        ta.*, 
        bu.username AS nick_name, 
        bu.avatar AS avatar, 
        JSON_ARRAYAGG(IFNULL(tp.url, '')) AS talkImgList 
    FROM 
        blog_talk ta 
    LEFT JOIN 
        blog_user bu ON ta.user_id = bu.id 
    LEFT JOIN 
        blog_talk_photo tp ON tp.talk_id = ta.id 
    GROUP BY 
        ta.id, bu.username, bu.avatar 
    ORDER BY 
        ta.createdAt DESC 
    LIMIT ? 
    OFFSET ?;
    `;
        const [data] = await connecttion.promise().query(talkSql, [limit, offset]);

        // 判断当前登录的用户是否以点赞
        const isLikePromises = data.map(async (item) => {
            return getIsLikeByIdAndType({ for_id: item.id, type: 2, user_id: user_id || item.ip });
        });

        const likeResults = await Promise.all(isLikePromises);
        data.forEach((item, index) => {
            item.is_like = likeResults[index];
        });

        return data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

/**
 * 获取说说总数
 */

export const getTalkCount = async () => {
    const talkSql = `
    SELECT 
        COUNT(*) AS count 
    FROM 
        blog_talk
    `;
    const [data] = await connecttion.promise().query(talkSql);
    return data[0].count;
}

/**
 * 说说点赞
 */
export const addTalkLike = async (talk_id) => {
    const talkSql = `
    UPDATE 
        blog_talk 
    SET 
        like_times = like_times + 1 
    WHERE 
        id = ?
    `;
    const [data] = await connecttion.promise().query(talkSql, [talk_id]);
    return data.affectedRows > 0;
}

/**
 * 取消说说点赞
 */
export const cancelTalkLike = async (talk_id) => {
    const talkSql = `
    UPDATE 
        blog_talk 
    SET 
        like_times = like_times - 1     
    WHERE 
        id = ?
    `;
    const [data] = await connecttion.promise().query(talkSql, [talk_id]);
    return data.affectedRows > 0;
}
