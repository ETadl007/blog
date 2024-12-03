import * as photosService from './photos.service.js';
import * as albumsService from './photosAlbum.service.js';
import { PAGE_SIZE } from '../app/app.config.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.PHOTO;

/**
 * 获取所有相册列表
 */

export const getAllAlbumList = async (req, res, next) => {
    try {
        const photos = await albumsService.getAllAlbumList();

        res.send(result("获取所有相册列表成功", photos))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取所有相册列表失败", 500))
    }
}

/**
 * 获取相册列表
 */
export const getAlbumList = async (req, res, next) => {
    try {
        const { current, size, album_name } = req.body;

        // 每页内容数量
        const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

        // 偏移量
        const offset = (current - 1) * limit;

        const photos = await albumsService.getAlbumList({ limit, offset, album_name });

        res.send(result("获取相册列表成功", { current, size, list: photos, total: photos.length }))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取相册列表失败", 500))
    }
}

/**
 * 根据相册id 获取图片列表
 */

export const getAllPhotosByAlbumId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const photos = await photosService.getAllPhotosByAlbumId(id);

        res.send(result("获取相册所有照片成功", photos))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取相册所有照片失败", 500))
    }
}

/**
 * 根据相册id 分页获取图片列表
 */
export const getPhotoListByAlbumId = async (req, res, next) => {

    try {
        const { current, size, id, status } = req.body;

        // 每页内容数量
        const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

        // 偏移量
        const offset = (current - 1) * limit;

        const photos = await photosService.getPhotoListByAlbumId({ id, limit, offset, status });

        res.send(result("获取相册照片成功", { current, size, list: photos, total: photos.length }))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取相册照片失败", 500))
    }
}

/**
 * 批量新增图片
 */
export const addPhotos = async (req, res, next) => {
    try {
        const { photoList } = req.body;
        const data = await photosService.addPhotos(photoList);

        res.send(result("批量新增图片成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "批量新增图片失败", 500))
    }
}



/**
 * 批量删除图片
 */
export const deletePhotos = async (req, res, next) => {
    try {
        const { imgList, type } = req.body;

        let idList = imgList.map((v) => v.id);

        const data = await photosService.deletePhotos({ idList, type });
 
        res.send(result("批量删除图片成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "批量删除图片失败", 500))
    }
}

/**
 * 批量恢复图片
 */
export const revertPhotos = async (req, res, next) => {
    try {
        const { idList } = req.body;

        const data = await photosService.revertPhotos(idList);

        res.send(result("批量恢复图片成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "批量恢复图片失败", 500))
    }
}


/**
 * 新增相册
 */
export const addAlbum = async (req, res, next) => {
    try {
        const { album_name, album_cover, description } = req.body;

        const one = await albumsService.getOneAlbum({ album_name });
        if (one) {
            return next(errorResult(errorCode, "相册名称已存在", 500))
        }
        const data = await albumsService.addAlbum({ album_name, album_cover, description });

        res.send(result("新增相册成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "新增相册失败", 500))
    }
}


/**
 * 删除相册
 */
export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await albumsService.deleteAlbum(id);

        res.send(result("删除相册成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "删除相册失败", 500))
    }
}

/*
 * 修改相册
 */
export const updateAlbum = async (req, res, next) => {
    try {
        const { id, album_name, album_cover, description } = req.body;
        const data = await albumsService.updateAlbum({ id, album_name, album_cover, description });

        res.send(result("修改相册成功", data))
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "修改相册失败", 500))
    }
}