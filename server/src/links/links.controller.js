import * as linksService from './links.service.js';
import { PAGE_SIZE } from '../app/app.config.js';
import { addNotify } from '../notify/notify.controller.js';

/**
 * 获取友链列表
 */

export const getTalkList = async (req, res, next) => {
    // 当前页码
    let { current = 1, size, status } = req.body;

    // 每页内容数量
    const limit = parseInt(PAGE_SIZE, 10) || 6;

    // 偏移量
    const offset = (current - 1) * limit;

    try {
        const result = await linksService.getLinksList({status, limit, offset});
        const total = await linksService.getLinksCount();
        res.send({
            status: 0,
            message: '获取友链列表成功',
            data: {
                current,
                size,
                list: result,
                total
            }
        });
    } catch (err) {
        console.log(err);
        next(new Error('GETLINKSERROR'))
    }
}

/**
 * 新增友链 || 修改友链
 */

export const addOrUpdateLinks = async (req, res, next) => {
    
    try {

        const { id, site_name, site_desc, site_avatar, url, status, user_id } = req.body;

        const data = { id, site_name, site_desc, site_avatar, url, status, user_id };

        const result = await linksService.addOrUpdateLinks(data);

        if (!id) {
            await addNotify({
                user_id: 1,
                type: 4,
                message: `您的收到了来自于：${site_name} 的友链申请，点我去后台审核！`
            })
        }

        const msg = id ? "修改" : "发布";

        res.send({
            status: 0,
            message: `${msg}友链成功`,
            data: result
        });
        
    } catch (err) {
        console.log(err);
        const msg = req.body.id ? "修改" : "发布";
        res.status(400).send({
            error: `${msg}友链失败`, 
            details: err.message
        });
        
    }

}

/**
 * 修改友链状态
 */
export const updateLinksStatus = async (req, res, next) => {
    try {
        const { idList } = req.body;
        
        const result = await linksService.updateLinksStatus(idList);
        res.send({
            status: 0,
            message: '修改友链状态成功',
            data: result
        });
    } catch (err) {
        console.log(err);
        next(new Error('UPDATELINKSERROR'))
    }
}