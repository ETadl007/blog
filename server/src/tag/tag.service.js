import { connecttion } from "../app/database/mysql.js";

import moment from "moment";

/**
 * 获取所有标签
 */

export const getAllTag = async () => {
    const tagAllSql = `
    SELECT 
        id,
        tag_name 
    FROM 
        blog_tag`;
    const [data] = await connecttion.promise().query(tagAllSql);
    return data;
}

/**
 * 条件获取标签
 */
export const getTagList = async ({ tag_name, limit, offset }) => {

    try {
        const where = []
        const params = []

        if (tag_name) {
            where.push("tag_name LIKE ?")
            params.push(`%${tag_name}%`)
        }

        const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

        const tagListSql = `
    SELECT 
        id,
        tag_name,
        createdAt,
        updatedAt 
    FROM 
        blog_tag 
    ${whereSql}
    LIMIT ?
    OFFSET ?`;

        params.push(limit, offset)

        const [data] = await connecttion.promise().query(tagListSql, params);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

/**
 * 创建标签
 */
export const createTag = async (tag_name) => {

    // 手动设置时间
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')

    const createTagSql = `
    INSERT INTO 
        blog_tag (tag_name, createdAt, updatedAt) 
    VALUES 
        (?,?,?)`;
    const [data] = await connecttion.promise().query(createTagSql, [tag_name.tag_name, currentTime, currentTime]);
    return { id: data.insertId, tag_name: tag_name.tag_name };
}

/**
 * 根据id或者标签名称获取标签信息
 */
export const getOneTag = async ({ tag_name }) => {
    const sql = `
    SELECT
        id,
        tag_name
    FROM
        blog_tag
    WHERE
        tag_name = ?
    `
    const [data] = await connecttion.promise().query(sql, [tag_name]);
    return data[0];
}

/**
 * 批量增加文章标签关联
 */
export const createArticleTags = async (articleTagList) => {
    if (!articleTagList || articleTagList.length === 0) {
        throw new Error('No article tags to insert.');
    }

    // 获取当前时间
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // 构造插入值
    const values = articleTagList.map(({ article_id, tag_id }) => [
        article_id,
        tag_id,
        currentTime,
        currentTime,
    ]);

    // 构造占位符
    const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');

    const sql = `
    INSERT INTO blog_article_tag (article_id, tag_id, createdAt, updatedAt)
    VALUES ${placeholders}
    `;
    {
        const [data] = await connecttion.promise().query(sql, values.flat());

        // 返回插入的关联记录
        const insertedRecords = articleTagList.map((item, index) => ({
            article_id: item.article_id,
            tag_id: item.tag_id,
            insertId: data.insertId + index,
            createdAt: currentTime,
            updatedAt: currentTime,
        }));

        return insertedRecords;

    };
}
/**
 * 标签删除
 */
export const deleteTag = async ({ tagIdList }) => {
    try {
        const deleteTagSql = `
        DELETE FROM
            blog_tag
        WHERE
            id 
        IN 
            (?)`;
        const [data] = await connecttion.promise().query(deleteTagSql, [tagIdList]);
        return data.affectedRows > 0 ? true : false;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

/**
 * 添加标签
 */
export const addTag = async (tag_name) => {

    // 手动设置时间
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')

    const addTagSql = `
    INSERT INTO
        blog_tag (tag_name, createdAt, updatedAt)
    VALUES
        (?,?,?)`;
    const [data] = await connecttion.promise().query(addTagSql, [tag_name, currentTime, currentTime]);

    // 返回插入的标签
    const [NewTag] = await connecttion.promise().query(`SELECT id, tag_name FROM blog_tag WHERE id = ?`, [data.insertId]);
    return NewTag[0];
}

/**
 * 修改标签
 */
export const updateTag = async (id, tag_name) => {

    // 手动设置时间
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')

    const updateTagSql = `
    UPDATE
        blog_tag
    SET
        tag_name = ?,
        updatedAt = ?
    WHERE
        id = ?`;
    const [data] = await connecttion.promise().query(updateTagSql, [tag_name, updatedAt, id]);
    return data.affectedRows > 0 ? true : false;
}