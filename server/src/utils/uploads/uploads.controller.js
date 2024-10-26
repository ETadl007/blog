import * as uploadService from './uploads.service.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 用户头像上传
 */
export const upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.send({
                code: 400,
                message: '文件上传失败'
            });
        }

        const file = req.file;
        const user_id = req.username ? req.username.id : null;

        const result = await uploadService.uploadFile(file, user_id);

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

