import { connecttion } from "../app/database/mysql.js";
import { deletePhotosByAlbumId } from "./photos.service.js";

/**
 * 获取相册列表
 */

export const getAllAlbumList = async () => {
    const photosAllSql = `
    SELECT 
        id,
        album_name,
        album_cover,
        description,
        createdAt,
        updatedAt 
    FROM 
        blog_photo_album
    `;
    const [data] = await connecttion.promise().query(photosAllSql);
    return data;
}

/**
 * 分页获取相册列表
 */
export const getAlbumList = async ({limit, offset, album_name}) => {

    const where = []
    const params = []

    if(album_name){
        where.push("album_name LIKE ?")
        params.push(`%${album_name}%`)
    }

    const whereStr = where.length > 0? `WHERE ${where.join(" AND ")}` : ""

    const photosAllSql = `
    SELECT 
        id,
        album_name,
        album_cover,
        description,
        createdAt,
        updatedAt
    FROM 
        blog_photo_album
    ${whereStr}
    LIMIT ?
    OFFSET ?
    `;

    params.push(limit, offset)

    const [data] = await connecttion.promise().query(photosAllSql, params);
    return data;
}

/**
 * 新增相册
 */
export const addAlbum = async ({ album_name, album_cover, description }) => {
    const addAlbumSql = `
    INSERT INTO blog_photo_album (album_name, album_cover, description)
    VALUES (?, ?, ?)
    `;
    const [data] = await connecttion.promise().query(addAlbumSql, [album_name, album_cover, description]);
    return data;
}

/**
 * 根据id删除相册
 */
export const deleteAlbum = async (id) => {
    const [data] = await connecttion.promise().query("DELETE FROM blog_photo_album WHERE id = ?", [id]);

    //除相册下的图片
    await deletePhotosByAlbumId();

    return data.affectedRows > 0 ? true : false;
}

/**
 * 修改相册
 */
export const updateAlbum = async ({ id, album_name, album_cover, description }) => {
    const sql = `
    UPDATE 
        blog_photo_album 
    SET 
        album_name = ?, 
        album_cover = ?, 
        description = ? 
    WHERE 
        id = ?
    `
    const [data] = await connecttion.promise().query(sql, [album_name, album_cover, description, id]);
    return data.affectedRows > 0 ? true : false;
}

/**
 * 根据id 或 相册名称获取相册信息
 */
export const getOneAlbum = async (album_name) => {
    const where = []
    const params = []

    if(album_name){
        where.push("album_name = ?")
        params.push(album_name)
    }

    const whereStr = where.length > 0? `WHERE ${where.join(" AND ")}` : ""

    const photosAllSql = `
    SELECT 
        id,
        album_name,
        album_cover,
        description,
        createdAt,
        updatedAt
    FROM 
        blog_photo_album
    ${whereStr}
    LIMIT 1
    `;

    const [data] = await connecttion.promise().query(photosAllSql, params);
    return data[0] || null;
}