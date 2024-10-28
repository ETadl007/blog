import * as configService from './config.service.js';

/**
 * 获取网站配置
 */
export const storeWebConfig = async (req, res, next) => {
  try {
    const config = await configService.getWebConfig();
    res.send({
      status: 0,
      msg: '获取网站配置成功',
      data: config
    });
  } catch (err) {
    console.log(err);
    next(new Error('GETWEBCONFIGERROR'));
  }
}

/**
 * 设置访问量
 */

export const addView = async (req, res, next) => {
  try {
    const rows = await configService.getWebConfig();

    let flag = false;

    if (rows && rows.id) {
      const configId = rows.id;

      // 更新 view_time
      const result = await configService.addView(configId);

      if (result.affectedRows > 0) {
        flag = "添加成功";
      }
    } else {
      flag = "需要初始化";
    }

    res.send({
      status: 0,
      msg: '增加访问量成功',
      result: flag
    });
  } catch (err) {
    console.log(err);
    next(new Error('ADDVIEWERROR'));
  }
};