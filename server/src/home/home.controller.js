import * as homeService from './home.service.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.STATISTIC;

/**
 * 获取数据统计
 */
export const storeStatistic = async (req, res, next) => {
    try {
        const data = await homeService.getStatistic();

        res.send(result("获取数据统计成功", data))

    }catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取数据统计失败", 500))
    }
}