import * as categoryService from './category.service.js';
import { PAGE_SIZE } from '../app/app.config.js';

import { result, ERRORCODE, errorResult } from '../result/index.js'
const errorCode = ERRORCODE.CATEGORY;

/**
 *  前台获取分类列表
 */
export const getCategoryDictionary = async (req, res, next) => {

    try {
        // 获取分类列表
        const categoryList = await categoryService.blogCategoryListService();

        res.send(result("获取分类列表成功", categoryList));

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取分类列表失败", 500))
    }

}

/**
 * 条件分页获取分类列表
 */
export const getCategoryList = async (req, res, next) => {

    try {
        // 获取参数
        const { current, size, category_name } = req.body;

        // 每页内容数量
        const limit = parseInt(size, 10) || parseInt(PAGE_SIZE, 10);

        // 偏移量
        const offset = (current - 1) * limit;

        // 调用服务层方法
        const data = await categoryService.getCategoryList({ category_name, limit, offset });

        // 返回结果
        res.send(result("获取分类列表成功", { list: data, total: data.length }))

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "获取分类列表失败", 500))
    }

}

/**
 * 分类新增
 */
export const addCategory = async (req, res, next) => {

    try {
        // 获取参数
        const { category_name } = req.body;

        // 调用服务层方法
        const data = await categoryService.createCategory({category_name});

        // 返回结果
        res.send(result("新增分类成功", data));

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "新增分类失败", 500))
    }

}

/**
 * 分类修改
 */
export const updateCategory = async (req, res, next) => {

    try {
        // 获取参数
        const { id, category_name } = req.body;

        // 调用服务层方法
        const data = await categoryService.updateCategory({ id, category_name });

        // 返回结果
        res.send(result("修改分类成功", data));

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "修改分类失败", 500))
    }

}

/**
 * 分类删除
 */
export const deleteCategory = async (req, res, next) => {

    try {
        // 获取参数
        const { categoryIdList } = req.body;

        // 调用服务层方法
        const data = await categoryService.deleteCategory(categoryIdList);

        if (data) {
            // 返回结果
            return res.send(result("删除分类成功", data))
        } else {
            return next(errorResult(errorCode, "分类不存在或删除分类失败", 500))
        }

    } catch (err) {
        console.log(err);
        return next(errorResult(errorCode, "删除分类失败", 500))
    }

}