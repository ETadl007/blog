import { connecttion } from "../app/database/mysql.js"
import moment from 'moment';

/**
 *  获取分类列表
 */
export const blogCategoryListService = async () => {

    let CategoryListSql = `
    SELECT 
       id,
       category_name,
       createdAt,
       updatedAt
    FROM 
        blog_category
    `;

    // 执行查询
    const [CategoryListResult] = await connecttion.promise().query(CategoryListSql);

    // 返回结果
    return CategoryListResult

}

/**
 * 条件分页获取分类列表
 */
export const getCategoryList = async ({ category_name, limit, offset }) => {

    const where = []
    const params = []
    if (category_name) {
        where.push('category_name LIKE ?');
        params.push(`%${category_name}%`)
    }

    // 动态拼接 WHERE 子句
    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    let CategoryListSql = `
    SELECT 
       id,
       category_name,
       createdAt,
       updatedAt
    FROM 
        blog_category
    ${whereSql}
    LIMIT ?
    OFFSET ?
    `;

    // 添加 limit 和 offset 到参数数组
    params.push(limit, offset);

    // 执行查询
    const [CategoryListResult] = await connecttion.promise().query(CategoryListSql, params);

    // 返回结果
    return CategoryListResult

}

/**
 * 根据id或者分类名称获取分类信息
 */
export const getOneCategory = async ({ id, category_name }) => {
    const whereClause = [];
    const params = [];

    if (id) {
        whereClause.push('id = ?');
        params.push(id);
    }

    if (category_name) {
        whereClause.push('category_name = ?');
        params.push(category_name);
    }

    const whereSql = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    const sql = `
        SELECT
            id,
            category_name
        FROM
            blog_category
        ${whereSql}
    `;

    try {
        const [rows] = await connecttion.promise().query(sql, params);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

/**
 * 新增分类
 */
export const createCategory = async (category_name) => {

    // 手动设置时间
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const createCategorySql = `
    INSERT 
    INTO 
        blog_category (category_name, createdAt, updatedAt)
    VALUES 
        (?,?,?)
    `;

    // 执行查询
    const [result] = await connecttion.promise().query(createCategorySql, [category_name.category_name, createdAt, updatedAt]);

    // 返回结果
    return { id: result.insertId, category_name: category_name.category_name }
}


/**
 * 分类修改
 */
export const updateCategory = async ({ id, category_name }) => {

    // 手动设置时间
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    
    const updateCategorySql = `
    UPDATE 
        blog_category
    SET 
        category_name = ?,
        updatedAt = ?
    WHERE 
        id = ?
    `;

    // 执行查询
    const [result] = await connecttion.promise().query(updateCategorySql, [category_name, updatedAt, id]);

    // 返回结果
    return result.affectedRows > 0 ? true : false;
}

/**
 * 分类删除
 */
export const deleteCategory = async (categoryIdList) => {
    const deleteCategorySql = `
    DELETE 
    FROM 
        blog_category
    WHERE 
        id
    IN
        (?)
    `;
    // 执行查询
    const [result] = await connecttion.promise().query(deleteCategorySql, [categoryIdList]);

    // 返回结果
    return result.affectedRows;
}