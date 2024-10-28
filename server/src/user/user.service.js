import { connecttion } from "../app/database/mysql.js";

/**
 * 用户注册
 */

export const createUser = async (params) => {
    const statment = `
        INSERT INTO blog_user 
        (username, password, role, nick_name)
        VALUES
        (?, ?, ?, ?)
    `
    const [data] = await connecttion.promise().query(statment, params);
    return data;
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

export const updateOwnUserInfo = async ({nick_name, avatar, id}) => {
    
    const statment = `
        UPDATE 
            blog_user 
        SET 
            nick_name = ?,
            avatar = ?
        WHERE 
            id = ?
    `;
    try {
        
        const [data] = await connecttion.promise().query(statment, [nick_name, avatar, id]);
        return data.affectedRows === 1 ? true : false;
        
    } catch (error) {
        console.error(error);
        throw error
    }
};

/**
 * 修改密码
 */

 export const updatePassword = async (id, password) => {
    const statment = `
        UPDATE 
            blog_user 
        SET 
            password = ?
        WHERE 
            id = ?
    `;
    try {
        const [data] = await connecttion.promise().query(statment, [password, id]);
        return data.affectedRows === 1 ? true : false;
    } catch (error) {
        console.error(error);
        throw error
    }
}