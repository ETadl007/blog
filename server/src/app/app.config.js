import dotenv from "dotenv";

dotenv.config();

/**
 * 应用配置
 */
export const APP_PORT = process.env.APP_PORT || 3000;

/**
 * 数据库配置
 */
export const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

/**
 * 内容分页
 */
export const PAGE_SIZE = process.env.PAGE_SIZE


/**
 * 父级评论分页
 */
export const PARENT_COMMENT_PAGE_SIZE = process.env.PARENT_COMMENT_PAGE_SIZE

/**
 * 超级管理员密码
 */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

/**
 *  密钥配置
 */
export let { PRIVATE_KEY, PUBLIC_KEY } = process.env;
PRIVATE_KEY = Buffer.from(PRIVATE_KEY, 'base64').toString();
PUBLIC_KEY = Buffer.from(PUBLIC_KEY, 'base64').toString();