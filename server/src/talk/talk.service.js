import { connecttion } from "../app/database/mysql.js";
import { getIsLikeByIdAndType } from '../like/like.service.js'
import { publishTalkPhoto, deleteTalkPhoto } from './talkPhoto.service.js'

import moment from "moment";

/**
 * 前台获取说说列表
 */
export const blogGetTalkList = async ({ limit, offset, user_id }) => {
    try {

        const talkSql = `
          SELECT 
            ta.*, 
            bu.username AS nick_name, 
            bu.avatar AS avatar, 
            COALESCE(JSON_ARRAYAGG(tp.url), '[]') AS talkImgList,
            (SELECT COUNT(*) FROM blog_talk ta2 WHERE ta2.status = 1) AS total_count
          FROM 
            blog_talk ta 
          LEFT JOIN 
            blog_user bu ON ta.user_id = bu.id 
          LEFT JOIN 
            blog_talk_photo tp ON tp.talk_id = ta.id 
          WHERE 
            ta.status = 1
          GROUP BY 
            ta.id, bu.username, bu.avatar 
          ORDER BY 
            ta.is_top ASC,
            ta.createdAt DESC 
          LIMIT ? 
          OFFSET ?;
        `;

        const [data] = await connecttion.promise().query(talkSql, [limit, offset]);

        // 判断当前登录的用户是否已点赞
        const isLikePromises = data.map(async (item) => {
            return getIsLikeByIdAndType({ for_id: item.id, type: 2, user_id: user_id || item.ip });
        });

        const likeResults = await Promise.all(isLikePromises);
        data.forEach((item, index) => {
            item.is_like = likeResults[index];
        });

        // 提取总记录数
        const totalCount = data.length > 0 ? data[0].total_count : 0;

        // 组织数据
        const current = Math.floor(offset / limit) + 1;
        const size = limit;
        const list = data.map(item => ({
            id: item.id,
            user_id: item.user_id,
            content: item.content,
            status: item.status,
            is_top: item.is_top,
            like_times: item.like_times,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            nick_name: item.nick_name,
            avatar: item.avatar,
            talkImgList: JSON.parse(item.talkImgList),
            is_like: item.is_like,
        }));

        return { current, size, list, total: totalCount };
    } catch (error) {
        console.log(error)
        throw error
    }
}

/**
 * 后台获取说说列表
 */

export const getTalkList = async ({ limit, offset, user_id, status }) => {
    try {
        const whereClauses = [];
        const params = [];

        // 为主查询和子查询拼接 WHERE 条件
        if (status) {
            whereClauses.push("ta.status = ?");
            params.push(status); // 主查询参数
        }

        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

        // SQL 查询
        const talkSql = `
          SELECT 
            ta.*, 
            bu.username AS nick_name, 
            bu.avatar AS avatar, 
            COALESCE(JSON_ARRAYAGG(tp.url), '[]') AS talkImgList,
            (SELECT COUNT(*) FROM blog_talk ta2 ${whereStr.replace('ta.', 'ta2.')}) AS total_count
          FROM 
            blog_talk ta 
          LEFT JOIN 
            blog_user bu ON ta.user_id = bu.id 
          LEFT JOIN 
            blog_talk_photo tp ON tp.talk_id = ta.id 
          ${whereStr}
          GROUP BY 
            ta.id, bu.username, bu.avatar 
          ORDER BY 
            ta.createdAt DESC 
          LIMIT ? 
          OFFSET ?;
        `;

        // 为子查询补充参数，并添加分页参数
        if (status) {
            params.push(status); // 子查询的参数
        }
        params.push(limit, offset); // 分页参数

        // 执行查询
        const [data] = await connecttion.promise().query(talkSql, params);

        // 判断当前登录用户是否已点赞
        const isLikePromises = data.map(async (item) => {
            return getIsLikeByIdAndType({ for_id: item.id, type: 2, user_id: user_id || item.ip });
        });

        const likeResults = await Promise.all(isLikePromises);

        // 合并点赞信息
        data.forEach((item, index) => {
            item.is_like = likeResults[index];
        });

        // 提取总记录数
        const totalCount = data.length > 0 ? data[0].total_count : 0;

        // 组织数据返回
        const current = Math.floor(offset / limit) + 1;
        const size = limit;
        const list = data.map(item => ({
            id: item.id,
            user_id: item.user_id,
            content: item.content,
            status: item.status,
            is_top: item.is_top,
            like_times: item.like_times,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            nick_name: item.nick_name,
            avatar: item.avatar,
            talkImgList: JSON.parse(item.talkImgList),
            is_like: item.is_like,
        }));

        return { current, size, list, total: totalCount };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

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

/**
 * 发布说说
 */
export const publishTalk = async (talk) => {
    const { talkImgList, ...resTalk } = talk;

    // 手动设置时间
    resTalk.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    resTalk.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const sql = `
    INSERT INTO 
        blog_talk
    SET 
        ?
    `
    const [data] = await connecttion.promise().query(sql, [resTalk]);

    if (data.insertId) {
        let imglist = talkImgList.map(item => {
            return {
                talk_id: data.insertId,
                url: item.url
            }
        })
        await publishTalkPhoto(imglist);
    }

    return data.insertId;
}

/**
 * 修改说说
 */
export const updateTalk = async (talk) => {
    const { id, talkImgList, ...resTalk } = talk;

    // 手动设置时间
    resTalk.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    try {

        const [updateResult] = await connecttion.promise().query("UPDATE blog_talk SET ? WHERE id = ?", [resTalk, id]);

        // 删除关联的图片
        await deleteTalkPhoto(id);

        // 添加新的图片
        if (talkImgList && talkImgList.length > 0) {
            let imglist = talkImgList.map(item => {
                return {
                    talk_id: id,
                    url: item.url
                }
            })
            await publishTalkPhoto(imglist);
        }
        return updateResult.affectedRows > 0;
        
    } catch (err) {
        console.log(err)
        throw err
    }
}

/**
 * 根据id 获取说说详情
 */
export const getTalkById = async (id) => {
    const talkSql = `
    SELECT 
        ta.id,
        ta.content,
        ta.user_id,
        ta.status,
        ta.is_top,
        ta.like_times,
        ta.createdAt,
        ta.updatedAt, 
        JSON_ARRAYAGG(IFNULL(tp.url, '')) AS talkImgList 
    FROM 
        blog_talk ta 
    LEFT JOIN 
        blog_talk_photo tp ON tp.talk_id = ta.id 
    WHERE 
        ta.id = ?
    GROUP BY 
        ta.id 
    `;
    const [data] = await connecttion.promise().query(talkSql, [id]);
    return data[0];
}

/**
 * 切换置顶状态
 */
export const toggleTop = async (id, is_top) => {

    const talkSql = `
    UPDATE 
        blog_talk 
    SET 
        is_top = ?
    WHERE 
        id = ?
    `;
    const [data] = await connecttion.promise().query(talkSql, [is_top, id]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 恢复说说
 */
export const revertTalk = async (id) => {
    const talkSql = `
    UPDATE 
        blog_talk 
    SET 
        status = 1
    WHERE 
        id = ?
    `;
    const [data] = await connecttion.promise().query(talkSql, [id]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 公开/私密
 */
export const togglePublic = async (id, status) => {
    const talkSql = `
    UPDATE 
        blog_talk 
    SET 
        status = ?
    WHERE 
        id = ?
    `;
    const [data] = await connecttion.promise().query(talkSql, [status, id]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 删除说说
 */
export const deleteTalkById = async (id, status) => {
    let res;
    if (Number(status) === 1 || Number(status) === 2) {
        const [updateResult] = await connecttion.promise().query("UPDATE blog_talk SET status = 3 WHERE id = ?", [id]);
        res = updateResult.affectedRows > 0 ? true : false;
    } else {
        const [deleteResult] = await connecttion.promise().query("DELETE FROM blog_talk WHERE id = ?", [id]);
        res = deleteResult.affectedRows > 0 ? true : false;

        await publishTalkPhoto(id);
    }

    return res
}