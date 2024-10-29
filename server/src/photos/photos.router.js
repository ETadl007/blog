import express from 'express';
import * as photosController from './photos.controller.js';

const router = express.Router({
    prefixKey: '/photo'
});

/**
 * 获取相册列表
 */
router.get('/photoAlbum/getAllAlbumList', photosController.getAlbumList);

/**
 * 获取相册所有照片
 */

router.get('/photo/getAllPhotosByAlbumId/:id', photosController.getAllAlbumList);

/**
 * 导出路由
 */
export default router;