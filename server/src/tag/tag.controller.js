import * as tagService from './tag.service.js';

/**
 * 获取所有标签
 */

export const storeTag = async (req, res, next) => {
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