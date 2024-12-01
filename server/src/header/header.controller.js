import * as headerService from './header.service.js';

/**
 * 获取所有背景图
 */
export const getAllHeader = async (req, res, next) => {
    try {
        const headers = await headerService.getAllHeader();
        res.send({
            status: 0,
            message: '获取所有背景图成功',
            data: headers
        })
    } catch (err) {
        console.log(err);
        next(new Error('GETALLHEADERERROR'))
    }
}

/**
 *  新增/修改背景图
 */
export const addOrUpdateHeader = async (req, res, next) => {
    try {
        const { id, route_name } = req.body;

        if (!id) {
            const flag = await headerService.getOneByPath(route_name);
            if (flag) {
                return res.send({
                    status: 1,
                    message: '已经存在相同的背景路径'
                })
            }
        }
        if (id) {
            const flag = await headerService.getOneByPath(route_name);
            if (flag.id != id) {
                return res.send({
                    status: 1,
                    message: '已经存在相同的背景路径'
                })
            }
        }
        const result = await headerService.addOrUpdateHeader(req.body);
        let msg = id ? "修改" : "新增";
        res.send({
            status: 0,
            message: `${msg}背景图成功`,
            data: result
        })
    } catch (err) {
        console.log(err);
        next(new Error('ADDORUPDATEHEADERERROR'))
    }
}

/**
 * 根据id删除背景
 */
export const deleteHeaderById = async (req, res, next) => {
    try {
        const { id, url } = req.body;

        const result = await headerService.deleteHeaderWithImage({ id, url });
        if (result) {
            res.send({
                status: 0,
                message: `删除背景图成功`,
                data: result,
            });
        } else {
            res.status(404).send({
                status: 1,
                message: `未找到该背景图或删除失败`,
                data: null,
            });
        }
    } catch (err) {
        console.log(err);
        next(new Error('DELETEHEADERBYIDERROR'))
    }
}