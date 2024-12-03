import * as uploadService from './uploads.service.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomNickname } from '../tool.js'

import { connecttion } from "../../app/database/mysql.js"

import { result, ERRORCODE, errorResult } from "../../result/index.js"
const errorCode = ERRORCODE.UPLOAD_FILE;

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
            return next(errorResult(errorCode, "文件上传失败", 500))
        }

        const file = req.file;

        const { id, nick_name } = req.user

        const data = await uploadService.userUploadFile(file, id, nick_name);

        const fileUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        res.send(result("头像更新成功", {url: fileUrl}))

        // 提交事务
        await connection.commit();
    } catch (error) {
        if (connection) await connection.rollback();
        console.log(error);
        return next(errorResult(errorCode, "文件上传失败", 500))
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
            return next(errorResult(errorCode, "文件上传失败", 500))
        }

        const file = req.file;
        const user_id = req.user ? req.user.id : null;
        const nick_name = randomNickname('游客', 5)

        const data = await uploadService.upoadFile(file, user_id, nick_name);

        const fileUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        res.send(result("头像更新成功", {url: fileUrl}))

        
        // 提交事务
        await connection.commit();

    } catch (error) {
        if (connection) await connection.rollback();
        console.log(error);
        return next(errorResult(errorCode, "文件上传失败", 500))
    } finally {
        if (connection) connection.release();
    }
};