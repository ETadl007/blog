import express from 'express';
import articleRouter from '../article/article.router.js';
import configRouter from '../config/config.router.js';
import tagRouter from '../tag/tag.router.js';
import homeStatistic from '../home/home.router.js';
import { defaultErrorHandler } from './app.middleware.js';
import commentRouter from '../comment/comment.router.js';
import categoryRouter from '../category/category.router.js';
import photosRouter from '../photos/photos.router.js';
import talkRouter from '../talk/talk.router.js';
import linksRouter from '../links/links.router.js';
import messageRouter from '../message/message.router.js';
import userRouter from '../user/user.router.js';
import authRouter from '../auth/auth.router.js';
import notifyRouter from '../notify/notify.router.js';
import likeRouter from '../like/like.router.js';
import uploadRouter from '../utils/uploads/uploads.router.js';
import { TimesLimiter } from '../app/app.middleware.js';

/**
 *  创建应用
 */
const app = express();

// 信任代理
app.set('trust proxy', 1);

// 全局限流配置
app.use(TimesLimiter({
  windowMs: 1 * 60 * 1000, // 1分钟
  prefixKey: "",
  limit: 100, // 这里设置一个合理的全局限制
  message: "小黑子，你在刷接口！！",
}));

/**
 *  处理JSON数据
 */
app.use(express.json());

/**
 *  处理路由
 */
app.use(articleRouter);
app.use(configRouter);
app.use(tagRouter);
app.use(homeStatistic);
app.use(commentRouter);
app.use(categoryRouter);
app.use(photosRouter);
app.use(talkRouter);
app.use(linksRouter);
app.use(messageRouter);
app.use(userRouter);
app.use(authRouter);
app.use(notifyRouter);
app.use(likeRouter);
app.use(uploadRouter);

/**
 *  默认异常处理
 */
app.use(defaultErrorHandler);

/**
 *  导出应用
 */
export default app;