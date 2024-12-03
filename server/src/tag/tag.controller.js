import * as tagService from './tag.service.js';
import { PAGE_SIZE } from '../app/app.config.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.TAG;

/**
 * 获取所有标签
 */

export const getTagDictionary = async (req, res, next) => {
    try {
        const tag = await tagService.getAllTag();

        res.send(result("获取标签成功", tag))
    } catch (err) {
        return next(errorResult(errorCode, "获取标签失败", 500))
    }
}

/**
 * 条件获取标签
 */
export const getTagList = async (req, res, next) => {
    try {
        const { current, size, tag_name } = req.body;

        // 每页内容数量
        const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

        // 偏移量
        const offset = (current - 1) * limit;

        const tag = await tagService.getTagList({ tag_name, limit, offset });

        res.send(result("获取标签成功", { current, size, list: tag, total: tag.length }))
    } catch (err) {
        return next(errorResult(errorCode, "获取标签失败", 500))
    }
}

/**
 * 标签删除
 */
export const deleteTag = async (req, res, next) => {
    try {
        const { tagIdList } = req.body;
        const tag = await tagService.deleteTag({ tagIdList });
        
        res.send(result("删除标签成功", { updateNum: tag }))

    } catch (err) {
        return next(errorResult(errorCode, "删除标签失败", 500))
    }
}

/**
 * 添加标签
 */
export const addTag = async (req, res, next) => {
    try {
        const { tag_name } = req.body;
        const tag = await tagService.addTag(tag_name);

        res.send(result("添加标签成功", { tag: tag.id, tag_name: tag.tag_name }))

    } catch (err) {
        return next(errorResult(errorCode, "添加标签失败", 500))
    }
}

/**
 * 修改标签
 */
export const updateTag = async (req, res, next) => {
    try {
        const { id, tag_name } = req.body;
        const tag = await tagService.updateTag(id, tag_name);

        res.send(result("修改标签成功", tag))

    } catch (err) {
        return next(errorResult(errorCode, "修改标签失败", 500))
    }
}