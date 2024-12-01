import * as uploadService from './uploads.service.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomNickname } from '../tool.js'

import { connecttion } from "../../app/database/mysql.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 用户头像上传
 */
export const userUpload = async (req, res, next) => {

    // 用于管理事务的连接
    let connection;

    try {

        // 从连接池获取连接
        connection = await connecttion.promise().getConnection();
        // 开启事务 方便回滚
        await connection.beginTransaction();

        if (!req.file) {
            if (connection) await connection.rollback();
            return res.send({
                code: 400,
                message: '文件上传失败'
            });
        }

        const file = req.file;

        const { id, nick_name } = req.user

        const result = await uploadService.userUploadFile(file, id, nick_name);

        const fileUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        res.send({
            status: 0,
            message: '头像更新成功',
            data: {
                url: fileUrl
            }
        });
        // 提交事务
        await connection.commit();
    } catch (error) {
        if (connection) await connection.rollback();
        console.log(error);
        next(new Error('FILEUPLOADERROR'));
    } finally {
        if (connection) connection.release();
    }
};

/**
 * 图片上传
 */

export const upload = async (req, res, next) => {
    // 用于管理事务的连接
    let connection;

    try {

        // 从连接池获取连接
        connection = await connecttion.promise().getConnection();
        // 开启事务 方便回滚
        await connection.beginTransaction();

        if (!req.file) {
            if (connection) await connection.rollback();
            return res.send({
                code: 400,
                message: '图片上传失败'
            });
        }

        const file = req.file;
        const user_id = req.user ? req.user.id : null;
        const nick_name = randomNickname('游客', 5)

        const result = await uploadService.upoadFile(file, user_id, nick_name);

        const fileUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        res.send({
            status: 0,
            message: '图片上传成功',
            data: {
                url: fileUrl,
                result
            }
        });
        
        // 提交事务
        await connection.commit();

    } catch (error) {
        if (connection) await connection.rollback();
        console.log(error);
        next(new Error('FILEUPLOADERROR'));
    } finally {
        if (connection) connection.release();
    }
};