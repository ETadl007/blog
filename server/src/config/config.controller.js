import * as configService from './config.service.js';

import { result, ERRORCODE, errorResult, tipsResult } from '../result/index.js'
const errorCodeUpload = ERRORCODE.UPLOAD;
const errorCodeConfig = ERRORCODE.CONFIG;

/**
 * 修改网站配置
 */
export const updateConfig = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log(req.body);
    
    const one = await configService.getConfigById(id);
    let data;

    if (one) {
      data = await configService.updateConfig(req.body);
    } else {
      data = await configService.createConfig(req.body);
    }

    res.send(result("修改网站配置成功", data))

  } catch (err) {
    console.error(err);
    return next(errorResult(errorCodeConfig, "修改网站配置失败", 500));
  }
}

/**
 * 获取网站配置
 */
export const storeWebConfig = async (req, res, next) => {
  try {
    const config = await configService.getWebConfig();
    if (config){
      res.send(result("获取网站配置成功", config))
    }else {
      res.send(tipsResult("请去博客后台完善博客信息"))
    }
  } catch (err) {
    console.log(err);
    return next(errorResult(errorCodeConfig, "获取网站配置失败", 500));
  }
}

/**
 * 设置访问量
 */

export const addView = async (req, res, next) => {
  try {
      // 更新 view_time
      const data = await configService.addView();
      if (data == "添加成功"){
        res.send(result("增加访问量成功", data))
      }else if (data == "需要初始化"){
        res.send(tipsResult("请去博客后台完善博客信息"))
      }else {
        res.send(errorResult(errorCodeConfig, "增加访问量失败", 500))
      }
  } catch (err) {
    console.error(err);
    return next(errorResult(errorCodeConfig, "增加访问量失败", 500));
  }
};
