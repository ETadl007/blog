import * as headerService from './header.service.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.HEADER;

/**
 * 获取所有背景图
 */
export const getAllHeader = async (req, res, next) => {
    try {
        const headers = await headerService.getAllHeader();

        res.send(result("获取所有背景图成功", headers))
        
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取所有背景图失败", 500))
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
                return res.send(errorResult(errorCode, "已经存在相同的背景路径", 500))
            }
        }
        if (id) {
            const flag = await headerService.getOneByPath(route_name);
            if (flag.id != id) {
                return res.send(errorResult(errorCode, "已经存在相同的背景路径", 500))
            }
        }
        const data = await headerService.addOrUpdateHeader(req.body);

        let message = id ? "修改" : "新增";

        res.send(result(message + "背景图成功", data))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, message + "背景图失败", 500))
    }
}

/**
 * 根据id删除背景
 */
export const deleteHeaderById = async (req, res, next) => {
    try {
        const { id, url } = req.body;

        const data = await headerService.deleteHeaderWithImage({ id, url });
        if (result) {
            return res.send(result("删除背景图成功", data))
        } else {
           return res.send(errorResult(errorCode, "未找到该背景图或删除失败", 500))
        }
    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "删除背景图失败", 500))
    }
}