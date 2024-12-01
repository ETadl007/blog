import { connecttion } from "../app/database/mysql.js";

import moment from "moment";

/**
 * 获取友链列表
 */

export const getLinksList = async ({status, limit, offset}) => {

    const where = []
    const params = []

    if (status) {
        where.push("status = ?")
        params.push(status)
    }

    // 拼接SQL语句
    const whereSql = where.length > 0? `WHERE ${where.join(' AND ')}` : '';

    const linksSql = `
    SELECT 
        * 
    FROM 
        blog_links
    ${whereSql}
    ORDER BY 
        createdAt DESC 
    LIMIT ? 
    OFFSET ?;
    `;

    params.push(limit, offset);

    const [data] = await connecttion.promise().query(linksSql, params);
    return data;
}

/**
 * 获取友链总数
 */

export const getLinksCount = async () => {
    const linksSql = `
    SELECT 
        COUNT(*) AS count 
    FROM 
        blog_links
    WHERE
        status = ?;
    `;
        
    const [data] = await connecttion.promise().query(linksSql, 1);
    return data[0].count;
}

/**
 * 新增友链 || 修改友链
 */

export const addOrUpdateLinks = async (data) => {
    let res;

    // 手动设置时间
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    if (data.id) {
        // 修改友链
        const updateSql = `
        UPDATE 
            blog_links 
        SET 
            site_name = ?,
            site_desc = ?,
            site_avatar = ?,
            url = ?,
            status = ?,
            updatedAt = ?
        WHERE
            id = ?;
        `;
        const [result] = await connecttion.promise().query(updateSql, [data.site_name, data.site_desc, data.site_avatar, data.url, data.status, updatedAt, data.id]);
        res = result.affectedRows > 0;
    } else {
        // 新增友链
        const insertSql = `
        INSERT INTO 
            blog_links (site_name, site_desc, site_avatar, url, status, user_id, createdAt, updatedAt) 
        VALUES 
            (?,?,?,?,?,?,?,?);
        `;
        const [result] = await connecttion.promise().query(insertSql, [data.site_name, data.site_desc, data.site_avatar, data.url, data.status = 1, data.user_id, createdAt, updatedAt]);
        res = result.insertId ? true : false;
    }

    return res;
}

/**
 * 修改友链状态
 */
export const updateLinksStatus = async (id) => {

    // 手动设置时间
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const updateSql = `
    UPDATE 
        blog_links 
    SET 
        status = 2,
        updatedAt = ?
    WHERE
        id = ?;
    `;
    const [result] = await connecttion.promise().query(updateSql, [updatedAt, id]);
    return result.affectedRows > 0;
}