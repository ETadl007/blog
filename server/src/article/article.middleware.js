import { getArticleInfoByTitle } from './article.service.js';

import { result, ERRORCODE, errorResult } from "../result/index.js"
const errorCode = ERRORCODE.ARTICLE;

/**
 * 新增/编辑文章校验参数
 */
export const verifyArticleParam = async (req, res, next) => {
    const { article_title, author_id, category, article_content, tagList } = req.body;

    if (!category) {
        console.log("文章分类必传");
        return next(errorResult(errorCode, "文章分类必传", 500))
    }
    const { category_name } = category;

    if (!article_title || !author_id || !category_name || !article_content) {
        console.log("文章参数校验错误");
        return next(errorResult(errorCode, "文章参数校验错误", 500))
    }

    if (!tagList.length) {
        console.log("文章标签不能为空");
        return next(errorResult(errorCode, "文章标签不能为空", 500))
    }
    next();

}

/**
 * 新增文章判断标题是否已经存在过
 */
export const createJudgeTitleExist = async (req, res, next) => {
    const { article_title } = req.body;
    const result = await getArticleInfoByTitle({ article_title });
    if (result) {
        console.log("文章标题已存在");
        return next(errorResult(errorCode, "文章标题已存在", 500))
    }
    next();
}

/**
 * 编辑文章判断被修改的标题是否已经存在
 */
export const updateJudgeTitleExist = async (req, res, next) => {
    const { id, article_title } = req.body;
    const result = await getArticleInfoByTitle({ id, article_title });
    if (result) {
        console.log("文章标题已存在");
        return next(errorResult(errorCode, "文章标题已存在", 500))
    }
    next();
}

/**
 * 效验置顶参数
 */
export const verifyTopParam = async (req, res, next) => {
    const { id, is_top } = req.params
    if (!/^[0-9]+$/.test(id) || !/^[0-9]+$/.test(is_top)) {
        console.log("参数只能为数字");
        return next(errorResult(errorCode, "参数只能为数字", 500))
    }
    next();
}

/**
 * 效验删除参数
 */
export const verifyDelParam = async (req, res, next) => {
    const { id, status } = req.params
    if (!/^[0-9]+$/.test(id) || !/^[0-9]+$/.test(status)) {
        console.log("参数只能为数字");
        return res.status(400).json({
            status: 1,
            message: '参数只能为数字'
        });
    }
    next();
}