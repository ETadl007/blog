import { connecttion } from "../app/database/mysql.js";

/**
 * 获取网站配置信息
 */

export const getWebConfig = async () => {
    const configSql = `
    SELECT 
        id,
        blog_name,
        (SELECT avatar FROM blog_user WHERE id = 1) AS blog_avatar,
        avatar_bg,
        personal_say,
        blog_notice,
        qq_link,
        we_chat_link,
        github_link,
        git_ee_link,
        bilibili_link,
        view_time,
        createdAt,
        updatedAt,
        we_chat_group,
        qq_group,
        we_chat_pay,
        ali_pay
    FROM 
        blog_config
    `;
    const [data] = await connecttion.promise().query(configSql);
    return data[0];
}

export const addView = async (configId) => {
    const addViewSql = `
    UPDATE
        blog_config
    SET
        view_time = view_time + 1
    WHERE
        id = ?
    `
    const [data] = await connecttion.promise().query(addViewSql, [configId]);

    return data
}