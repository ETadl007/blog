import express from 'express';
import * as photosController from './photos.controller.js';
import { authGuard, needAdminAuthNotNeedSuper } from '../auth/auth.middleware.js'

const router = express.Router({
    prefixKey: '/photo'
});

/**
 * 获取相册列表
 */
router.get('/photoAlbum/getAllAlbumList', photosController.getAllAlbumList);

/**
 * 获取相册列表
 */
router.post('/photoAlbum', photosController.getAlbumList);

/**
 * 获取相册所有照片
 */

router.get('/photo/getAllPhotosByAlbumId/:id', photosController.getAllPhotosByAlbumId);

/**
 * 根据相册id 分页获取图片列表
 */
router.post('/photo/getPhotoListByAlbumId', photosController.getPhotoListByAlbumId);

/**
 * 批量新增图片
 */
router.post('/photo/add', authGuard, needAdminAuthNotNeedSuper, photosController.addPhotos);

/**
 * 批量删除图片
 */
router.put('/photo/delete', authGuard, needAdminAuthNotNeedSuper, photosController.deletePhotos);

/**
 * 批量恢复图片
 */
router.put('/photo/revert', authGuard, needAdminAuthNotNeedSuper, photosController.revertPhotos);



/**
 * 新增相册
 */
router.post('/photoAlbum/add', authGuard, needAdminAuthNotNeedSuper, photosController.addAlbum);

/**
 * 删除相册
 */
router.delete('/photoAlbum/delete/:id', authGuard, needAdminAuthNotNeedSuper, photosController.deleteAlbum);

/**
 * 修改相册
 */
router.put('/photoAlbum/update', authGuard, needAdminAuthNotNeedSuper, photosController.updateAlbum);

/**
 * 导出路由
 */
export default router;