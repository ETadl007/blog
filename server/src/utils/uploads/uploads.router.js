import express from 'express';
import { uploadConfig, validateImage } from './uploads.middleware.js';
import * as uploadsController from './uploads.controller.js';
import { TimesLimiter } from '../../app/app.middleware.js'
import { authGuard, needAdminAuth } from '../../auth/auth.middleware.js'

const router = express.Router({
    prefixKey: "/uploads"
});

/**
 * 用户头像上传
 */

router.post('/upload/user/img', TimesLimiter({
    prefixKey: "post/img",
    message: "上传图片过于频繁 请稍后再试",
    max: 10,
}), authGuard, uploadConfig, validateImage, uploadsController.userUpload);


/**
 * 图片上传
 */
router.post('/upload/img', TimesLimiter({
    prefixKey: "post/img",
    message: "上传图片过于频繁 请稍后再试",
    max: 10,
}), uploadConfig, validateImage, uploadsController.upload);

export default router;
