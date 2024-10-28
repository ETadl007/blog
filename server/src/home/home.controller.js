import * as homeService from './home.service.js';

/**
 * 获取数据统计
 */
export const storeStatistic = async (req, res, next) => {
    try {
        const data = await homeService.getStatistic();
        res.send({
            status: 0,
            msg: '获取数据统计成功',
            data
        });
    }catch (err) {
        console.log(err);
        next(new Error('GETDATASTATISTICERROR'));
    }
}