import { connecttion } from "../app/database/mysql.js";
import fs from "fs";
import path from "path";

import moment from "moment";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * 用户注册
 */

export const createUser = async ({ username, password, role, nick_name }) => {

    // 手动设置时间
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')

    const statment = `
        INSERT INTO blog_user 
        (username, password, role, nick_name, createdAt, updatedAt)
        VALUES
        (?, ?, ?, ?, ?, ?)
    `
    const [data] = await connecttion.promise().query(statment, [username, password, role, nick_name, currentTime, currentTime]);

    // 获取插入的 ID
    const userId = data.insertId;

    // 查询刚插入的用户信息
    const [user] = await connecttion.promise().query(
        'SELECT id, username FROM blog_user WHERE id = ?',
        [userId]
    );
    return user[0];
}

/**
 * 按用户名查询用户
 */

export const getUserByName = async (name, options = {}) => {

    const { password } = options;

    const statment = `
    SELECT 
        id, 
        username,
        role,
        nick_name,
        avatar,
        qq
        ${password ? ', password' : ''} 
    FROM 
        blog_user 
    WHERE 
        username = ?
    `;
    const [data] = await connecttion.promise().query(statment, name);

    // 只提供第一个用户信息
    return data[0];
}

/**
 * 按ID查询用户
 */
export const getUserById = async (id, options = {}) => {

    const { password } = options;

    const statment = `
    SELECT 
        id, 
        username,
        role,
        nick_name,
        avatar,
        qq
        ${password ? ', password' : ''} 
    FROM 
        blog_user 
    WHERE 
        id = ?
    `;
    const [data] = await connecttion.promise().query(statment, id);

    // 只提供第一个用户信息
    return data[0];
}


/**
 * 获取当前登录用户信息
 */

export const getUserinfo = async (id) => {
    const statment = `
        SELECT 
            id, 
            role,
            avatar,
            qq,
            nick_name,
            ip AS ipAddress
        FROM 
            blog_user 
        WHERE 
            id = ?
    `;

    const [data] = await connecttion.promise().query(statment, id);
    return data[0]
}

/**
 * 更新当前登录用户信息
 */

export const updateOwnUserInfo = async ({ nick_name, avatar, id }) => {

    // 手动设置时间
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')

    const statment = `
        UPDATE 
            blog_user 
        SET 
            nick_name = ?,
            avatar = ?,
            updatedAt = ?
        WHERE 
            id = ?
    `;
    try {

        const [data] = await connecttion.promise().query(statment, [nick_name, avatar, updatedAt, id]);
        return data.affectedRows === 1 ? true : false;

    } catch (error) {
        console.error(error);
        throw error
    }
};

/**
 * 修改密码
 */

export const updatePassword = async (id, password1) => {

    // 手动设置时间
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')

    const statment = `
        UPDATE 
            blog_user 
        SET 
            password = ?,
            updatedAt = ?
        WHERE 
            id = ?
    `;
    try {
        const [data] = await connecttion.promise().query(statment, [password1, updatedAt, id]);
        return data.affectedRows === 1 ? true : false;
    } catch (error) {
        console.error(error);
        throw error
    }
}

/**
 * 分页获取用户列表
 */
export const getUserList = async ({ nick_name, role, limit, offset }) => {

    // 条件 通过昵称搜索或通过角色搜索
    const where = []
    const params = []

    if (nick_name) {
        where.push('nick_name LIKE ?')
        params.push(`%${nick_name}%`)
    }

    if (role) {
        where.push('role = ?')
        params.push(role)
    }

    const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const sql = `
    SELECT 
        id,
        username,
        role,
        nick_name,
        avatar,
        qq,
        ip,
        createdAt,
        updatedAt

    FROM 
        blog_user
    ${whereStr}
    LIMIT ? 
    OFFSET ?
    `

    params.push(limit, offset)

    const [data] = await connecttion.promise().query(sql, params);
    return data;
}

/**
 * 修改角色
 */
export const updateRole = async (id, role) => {

    // 手动设置时间
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')

    const statment = `
        UPDATE 
            blog_user 
        SET 
            role = ?,
            updatedAt = ?
        WHERE 
            id = ?
    `;
    try {
        const [data] = await connecttion.promise().query(statment, [role, updatedAt, id]);
        return data.affectedRows === 1 ? true : false;
    } catch (error) {
        console.error(error);
        throw error
    }
}

/**
 * 删除服务器下的照片
 */
export const deleteOnlineImgs = async (imgList) => {
    Array.isArray(imgList) &&
        imgList.length &&
        imgList.forEach((v) => {
            if (v) {
                let filePath = path.join(__dirname, '../../uploads', 'images', path.basename(v));
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (err) {
                    console.error(`Error deleting image file: ${err}`);
                    throw new Error('IMAGE_DELETE_ERROR');
                }
            }
        });
}

/**
 * 管理员根据用户id修改用户的信息
 */
export const adminUpdateUserInfo = async ({ id, nick_name, avatar }) => {
    // 手动设置时间
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')

    const statment = `
        UPDATE 
            blog_user 
        SET 
            nick_name = ?,
            avatar = ?,
            updatedAt = ?
        WHERE 
            id = ?
    `;
    try {
        const [data] = await connecttion.promise().query(statment, [nick_name, avatar, updatedAt, id]);
        return data.affectedRows === 1 ? true : false;
    } catch (error) {
        console.error(error);
        throw error
    }
}

/**
 * 修改用户ip地址
 */
export const updateIp = async (id, ip) => {
    // 手动设置时间
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')

    const statment = `
        UPDATE 
            blog_user 
        SET 
            ip = ?,
            updatedAt = ?
        WHERE 
            id = ?
    `;
    try {
        const [data] = await connecttion.promise().query(statment, [ip, updatedAt, id]);
        return data.affectedRows === 1 ? true : false;
    } catch (error) {
        console.error(error);
        throw error
    }
}