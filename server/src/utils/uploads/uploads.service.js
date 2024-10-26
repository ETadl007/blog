import { connecttion } from "../../app/database/mysql.js";
import fs from 'fs'

/**
 * 检查用户是否已经上传了图片
 */
export const checkAndDeleteExistingFile = async (userId) => {
    try {
        const [rows] = await connecttion.promise().query(
            'SELECT * FROM blog_files WHERE user_id = ?',
            [userId]
        );

        if (rows.length > 0) {
            const oldFilePath = rows[0].path;

            // 检查文件是否存在
            if (fs.existsSync(oldFilePath)) {
                // 删除旧文件
                fs.unlinkSync(oldFilePath);
            } else {
                console.warn(`文件 ${oldFilePath} 不存在，无需删除`);
            }

            // 删除数据库记录
            await connecttion.promise().query(
                'DELETE FROM blog_files WHERE user_id = ?',
                [userId]
            );
        }
    } catch (error) {
        console.error('检查并删除现有文件时发生错误:', error);
        throw error;
    }
};


/**
 * 文件上传
 */
export const uploadFile = async (file, user_id) => {

    try {
        // 检查并删除现有文件
        await checkAndDeleteExistingFile(user_id);

        const { fieldname, filename, originalname, size, mimetype, path } = file;

        const sql = `
            INSERT INTO 
                blog_files (user_id, fieldname, filename, originalname, mimetype, size, path) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [user_id, fieldname, filename, originalname, mimetype, size, path];

        const [result] = await connecttion.promise().query(sql, values);

        return result;
    } catch (error) {
        console.error('上传文件时发生错误:', error);
        throw error;
    }
};
