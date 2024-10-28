import * as uploadService from './uploads.service.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomNickname } from '../tool.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 用户头像上传
 */
export const userUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.send({
                code: 400,
                message: '文件上传失败'
            });
        }

        const file = req.file;
        const { id, nick_name } = req.username

        const result = await uploadService.userUpoadFile(file, id, nick_name);

        const fileUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        res.send({
            status: 0,
            message: '头像更新成功',
            data: {
                url: fileUrl,
                result
            }
        });
    } catch (error) {
        console.log(error);
        next(new Error('FILEUPLOADERROR'));
    }
};

/**
 * 图片上传
 */

export const upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.send({
                code: 400,
                message: '图片上传失败'
            });
        }

        const file = req.file;
        const user_id = req.username ? req.username.id : null;
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
    } catch (error) {
        console.log(error);
        next(new Error('FILEUPLOADERROR'));
    }
};