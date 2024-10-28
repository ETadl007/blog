import * as categoryService from './category.service.js';

/**
 *  获取分类列表
 */
export const getCategoryList = async (req, res, next) => {

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