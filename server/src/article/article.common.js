import { getOneCategory, createCategory } from '../category/category.service.js'
import { getOneTag, createTag } from '../tag/tag.service.js'
import { createArticleTags } from '../tag/tag.service.js'

import { connecttion } from '../app/database/mysql.js'

/**
 * 新增和编辑文章关于分类的公共方法
 */
export const createCategoryOrReturn = async (id, category_name) => {
    let finalId;
    if (id) {
        finalId = id;
    } else {
        let oneTag = await getOneCategory({ id, category_name })
        if (oneTag) {
            finalId = oneTag.id
        } else {
            let newTag = await createCategory({ category_name })
            finalId = newTag.id
        }
    }
    return finalId;
}

/**
 * 进行添加文章分类与标签关联的公共方法
 */
export const createArticleTagByArticleId = async (articleId, tagList) => {
    
    let resultList = [];

    // 先将新增的tag进行保存，拿到tag的id，再进行标签 文章关联
    let promiseList = tagList.map(async tag => {
        if (!tag.id) {
            let res;
            let one = await getOneTag({ tag_name: tag.tag_name });
            if (one) {
                res = one;
            } else {
                res = await createTag(tag);
            }
            return res;
        }
    });

    // 组装添加了标签id后的标签列表
    const res = await Promise.all(promiseList);
    res.forEach(r => {
        if (r) {
            let i = tagList.findIndex(tag => tag.tag_name === r.tag_name);
            if (i !== -1) {
                tagList[i].id = r.id;
            }
        }
    });

    // 文章id和标签id 关联
    if (articleId) {
        let articleTagList = tagList.map(tag => ({
            article_id: articleId,
            tag_id: tag.id,
        }));

        // 批量新增文章标签关联
        resultList = await createArticleTags(articleTagList);
    }
    
    return resultList;
}

/**
 * 根据文章id删除文章标签关联
 */
export const deleteArticleTag = async (articleId) => {
    const [result] = await connecttion.promise().query("DELETE FROM blog_article_tag WHERE article_id = ?", [articleId]);
    return result;
}

