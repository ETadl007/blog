import { connecttion } from "../app/database/mysql.js";
import path from "path";
import fs from "fs";

import moment from "moment";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 获取所有背景图
 */
export const getAllHeader = async () => {
    const sql = `
    SELECT 
        id,
        route_name,
        bg_url 
    FROM 
        blog_header
    `
    const [data] = await connecttion.promise().query(sql);
    return data;
}

/**
 *  新增/修改背景图
 */
export const addOrUpdateHeader = async (data) => {
    const { id, route_name, bg_url } = data;

    // 手动设置时间
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    let res;
    if (id) {
        const sql = `
        UPDATE 
            blog_header 
        SET 
            route_name =?,
            bg_url =?,
            updatedAt =?
        WHERE 
            id =?
        `
        const [result] = await connecttion.promise().query(sql, [route_name, bg_url, updatedAt, id]);
        res = result.affectedRows > 0 ? true : false;
    } else {
        const sql = `
        INSERT INTO 
            blog_header (route_name, bg_url, createdAt, updatedAt)
        VALUES (?,?,?,?)
        `
        const [result] = await connecttion.promise().query(sql, [route_name, bg_url, createdAt, updatedAt]);
        res = result.affectedRows > 0 ? true : false;
    }


    return res;
}

/**
 * 根据路径查询头部信息
 */
export const getOneByPath = async (route_name) => {
    const sql = `
    SELECT 
        id,
        route_name,
        bg_url 
    FROM 
        blog_header
    WHERE 
        route_name =?
    `
    const [data] = await connecttion.promise().query(sql, [route_name]);
    return data[0];
}

/**
 * 根据id删除背景
 */
export const deleteHeaderById = async (id) => {
    const sql = `
    DELETE FROM 
        blog_header
    WHERE 
        id =?
    `
    const [result] = await connecttion.promise().query(sql, [id]);
    return result.affectedRows > 0 ? true : false;
}

/**
 * 删除背景图
 */
export const deleteHeaderWithImage = async ({id, url}) => {
    if (url) {
        // 构建图片文件路径
        const imagePath = path.join(__dirname, '../../uploads', 'images', path.basename(url));
        try {
            // 检查文件是否存在
            if (fs.existsSync(imagePath)) {
                // 删除图片文件
                fs.unlinkSync(imagePath);
            }
        } catch (err) {
            console.error(`Error deleting image file: ${err}`);
            throw new Error('IMAGE_DELETE_ERROR');
        }
    }

    // 删除数据库记录
    const result = await deleteHeaderById(id);
    return result;
}