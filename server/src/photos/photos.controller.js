import * as photosService from './photos.service.js';

/**
 * 获取相册列表
 */

export const getAlbumList = async (req, res, next) => {
    try {
        const photos = await photosService.getAlbumList();
        res.send({
            status: 0,
            message: '获取相册列表成功',
            data: photos
        });
    } catch (err) {
        console.log(err);
        next(new Error('GETALBUMLISTERROR'))
    }
}

/**
 * 获取相册所有照片
 */

export const getAllAlbumList = async (req, res, next) => {
    const { id } = req.params;
    try {
        const photos = await photosService.getAllAlbumList(id);
        res.send({
            status: 0,
            message: '获取相册所有照片成功',
            data: photos

        });
        
    } catch (err) {
        console.log(err);
        next(new Error('GETALLALBUMLISTERROR'))
    }
}
