import { connecttion } from "../app/database/mysql.js";

import moment from "moment";

/**
 * 根据相册id 获取图片列表
 */

export const getAllPhotosByAlbumId = async (albumId) => {
    const photosAllSql = `
    SELECT 
        * 
    FROM 
        blog_photo
    WHERE
        album_id = ? AND status = 1
    `;     
    const [data] = await connecttion.promise().query(photosAllSql, albumId);
    return data;
}

/**
 * 根据相册id 分页获取图片列表
 */
export const getPhotoListByAlbumId = async ({ id, limit, offset, status }) => {
    const photosAllSql = `
    SELECT 
        id,
        album_id,
        url,
        status,
        createdAt,
        updatedAt 
    FROM 
        blog_photo
    WHERE
        album_id = ? AND status = ?
    LIMIT ?
    OFFSET ?
    `;     
    const [data] = await connecttion.promise().query(photosAllSql, [id, status, limit, offset]);
    return data;
}

/**
 * 批量新增图片
 */
export const addPhotos = async (photoList) => {
    // 当前时间
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // 构造插入值
    const values = photoList.map((photo) => [
        photo.album_id, 
        photo.url, 
        currentTime, 
        currentTime  
    ]);

    // 构造占位符
    const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');

    const addPhotosSql = `
    INSERT INTO blog_photo (album_id, url, createdAt, updatedAt)
    VALUES ${placeholders}
    `;

    try {
        const [data] = await connecttion.promise().query(addPhotosSql, values.flat());
        return data;
    } catch (error) {
        console.error('添加照片失败:', error);
        throw error;
    }
};


/**
 * 批量删除图片
 */
export const deletePhotos = async ({idList, type}) => {

    let res;
    if (Number(type) == 1){
        const [data] = await connecttion.promise().query("UPDATE blog_photo SET status = 2 WHERE id IN (?)", [idList]);
        res = data.affectedRows > 0 ? true : false;
    }else{
        const [data] = await connecttion.promise().query("DELETE FROM blog_photo WHERE id IN (?)", [idList]);
        res = data.affectedRows > 0 ? true : false;
    }
    return res;
}

/**
 * 批量恢复图片
 */
export const revertPhotos = async (idList) => {
    const [data] = await connecttion.promise().query("UPDATE blog_photo SET status = 1 WHERE id IN (?)", [idList]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 根据相册id删除图片
 */
export const deletePhotosByAlbumId = async (albumId) => {
    const [data] = await connecttion.promise().query("DELETE FROM blog_photo WHERE album_id = ?", [albumId]);
    return data.affectedRows > 0 ? true : false;
}