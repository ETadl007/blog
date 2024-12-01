import * as tagService from './tag.service.js';
import { PAGE_SIZE } from '../app/app.config.js';

/**
 * 获取所有标签
 */

export const getTagDictionary = async (req, res, next) => {
    try {
        const tag = await tagService.getAllTag();
        res.send({
            status: 0,
            message: '获取标签成功',
            data: tag
        });
    } catch (err) {
        next(new Error('GETTAGLISTERROR'))
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
        res.send({
            status: 0,
            message: '获取标签成功',
            data: {
                current,
                size,
                list: tag,
                total: tag.length
            }
        });
    } catch (err) {
        next(new Error('GETTAGLISTERROR'))
    }
}

/**
 * 标签删除
 */
export const deleteTag = async (req, res, next) => {
    try {
        const { tagIdList } = req.body;
        const tag = await tagService.deleteTag(tagIdList);
        if (tag) {
            res.send({
                status: 0,
                message: '删除标签成功',
                data: tag
            });
        } else {
            res.send({
                status: 1,
                message: '删除标签失败',
                data: null
            });
        }

    } catch (err) {
        next(new Error('DELETETAGERROR'))
    }
}

/**
 * 添加标签
 */
export const addTag = async (req, res, next) => {
    try {
        const { tag_name } = req.body;
        const tag = await tagService.addTag(tag_name);
        res.send({
            status: 0,
            message: '添加标签成功',
            data: {
                tag: tag.id,
                tag_name: tag.tag_name
            }
        });

    } catch (err) {
        next(new Error('ADDTAGERROR'))
    }
}

/**
 * 修改标签
 */
export const updateTag = async (req, res, next) => {
    try {
        const { id, tag_name } = req.body;
        const tag = await tagService.updateTag(id, tag_name);
        res.send({
            status: 0,
            message: '修改标签成功',
            data: tag
        });

    } catch (err) {
        next(new Error('UPDATETAGERROR'))
    }
}