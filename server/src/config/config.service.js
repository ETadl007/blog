import { connecttion } from "../app/database/mysql.js";

import moment from "moment";

/**
 * 修改网站配置
 */
export const updateConfig = async (config) => {

    const { blog_name, blog_avatar, avatar_bg, personal_say, blog_notice, github_link } = config;

    // 手动设置时间
    const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const updateSql = `
    UPDATE
        blog_config
    SET
        blog_name = ?,
        blog_avatar = ?,
        avatar_bg = ?,
        personal_say = ?,
        blog_notice = ?,
        github_link = ?,
        updatedAt = ?
    WHERE
        id = 1
    `;
    const [data] = await connecttion.promise().query(updateSql, [blog_name, blog_avatar, avatar_bg, personal_say, blog_notice, github_link, updatedAt]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 创建网站配置
 */
export const createConfig = async (config) => {

    const { blog_name, blog_avatar, avatar_bg, personal_say, blog_notice, github_link } = config;

    // 手动设置时间
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const createSql = `
    INSERT INTO
        blog_config (blog_name, blog_avatar, avatar_bg, personal_say, blog_notice, github_link, createdAt, updatedAt)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [data] = await connecttion.promise().query(createSql, [blog_name, blog_avatar, avatar_bg, personal_say, blog_notice, github_link, createdAt, updatedAt]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 获取网站配置信息
 */

export const getWebConfig = async () => {
    const configSql = `
    SELECT 
        id,
        blog_name,
        blog_avatar,
        avatar_bg,
        personal_say,
        blog_notice,
        github_link,
        view_time,
        createdAt,
        updatedAt
    FROM 
        blog_config
    `;
    const [data] = await connecttion.promise().query(configSql);
    return data.length ? data[0] : false;
}

/**
 * 查询网站配置是否存在
 */
export const getConfigById = async (id) => {
    const configSql = `
    SELECT 
        id,
        blog_name,
        (SELECT avatar FROM blog_user WHERE id = 1) AS blog_avatar,
        avatar_bg,
        personal_say,
        blog_notice,
        github_link,
        view_time,
        createdAt,
        updatedAt
    FROM 
        blog_config
    WHERE
        id = ?
    `;
    const [data] = await connecttion.promise().query(configSql, [id]);
    return data[0];
}

export const addView = async () => {

    let flag = false;

    const addViewSql = `
    UPDATE
        blog_config
    SET
        view_time = view_time + 1
    WHERE
        id = ?
    `
    const [res] = await connecttion.promise().query("SELECT * FROM blog_config");
    
    if (res.length) {
        const firstConfigId = res[0].id;

        await connecttion.promise().query(addViewSql, [firstConfigId]);

        flag = "添加成功"
    } else {
        flag = "需要初始化"
    }
    return flag
}