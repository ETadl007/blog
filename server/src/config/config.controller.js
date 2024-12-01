import * as configService from './config.service.js';

/**
 * 修改网站配置
 */
export const updateConfig = async (req, res, next) => {
  try {
    const { id } = req.body;
    
    const one = await configService.getConfigById(id);
    let result;

    if (one) {
      result = await configService.updateConfig(req.body);
    } else {
      result = await configService.createConfig(req.body);
    }

    res.send({
      status: 0,
      message: '修改网站配置成功',
      data: result
    });

  } catch (err) {
    console.error(err);
    next(new Error('UPDATEWEBCONFIGERROR'));
  }
}

/**
 * 获取网站配置
 */
export const storeWebConfig = async (req, res, next) => {
  try {
    const config = await configService.getWebConfig();
    res.send({
      status: 0,
      message: '获取网站配置成功',
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

    let flag = '';
    let message = '增加访问量失败'; // 默认返回失败消息

    if (rows && rows.id) {
      const configId = rows.id;

      // 更新 view_time
      const result = await configService.addView(configId);

      if (result.affectedRows > 0) {
        flag = '添加成功';
        message = '增加访问量成功';
      }
    } else {
      flag = '需要初始化';
      message = '增加访问量失败';
    }

    res.send({
      status: flag === '添加成功' ? 0 : 1,
      message,
      result: flag,
    });
  } catch (err) {
    console.error(err);
    next(new Error('ADDVIEWERROR'));
  }
};
