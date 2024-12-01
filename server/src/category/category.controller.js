import * as categoryService from './category.service.js';
import { PAGE_SIZE } from '../app/app.config.js';


/**
 *  获取分类列表
 */
export const getCategoryDictionary = async (req, res, next) => {

    try {
        // 获取分类列表
        const categoryList = await categoryService.blogCategoryListService();
        res.status(200).send({
            status: 0,
            message: "获取分类列表成功",
            data: categoryList
        });

    } catch (err) {
        console.log(err);
        next(new Error('GETCATEGORYLISTERROR'));
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
        const result = await categoryService.getCategoryList({ category_name, limit, offset });

        // 返回结果
        res.status(200).send({
            status: 0,
            message: "获取分类列表成功",
            data: {
                list: result,
                total: result.length
            }
        });

    } catch (err) {
        console.log(err);
        next(new Error('GETCATEGORYLISTERROR'));
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
        const result = await categoryService.createCategory({category_name});

        // 返回结果
        res.status(200).send({
            status: 0,
            message: "新增分类成功",
            data: result
        });

    } catch (err) {
        console.log(err);
        next(new Error('ADDCATEGORYERROR'));
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
        const result = await categoryService.updateCategory({ id, category_name });

        // 返回结果
        res.status(200).send({
            status: 0,
            message: "修改分类成功",
            data: result
        });

    } catch (err) {
        console.log(err);
        next(new Error('UPDATECATEGORYERROR'));
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
        const result = await categoryService.deleteCategory(categoryIdList);

        if (result) {
            // 返回结果
            res.send({
                status: 0,
                message: "删除分类成功",
                data: result
            });
        } else {
            res.status(400).send({
                status: 1,
                message: "分类不存在或删除分类失败",
                data: null
            });
        }

    } catch (err) {
        console.log(err);
        next(new Error('DELETECATEGORYERROR'));
    }

}