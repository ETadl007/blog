import { getOneTag  } from './tag.service.js'

export const verifyTag = async (req, res, next) => {
    const { id, tag_name } = req.body
    if (!tag_name) {
        console.log("标签名不能为空");
        return res.status(400).json({ status: 1, message: "标签名不能为空" });
    }
    let tag = await getOneTag(id)
    if (tag && tag.id !== id) {
        console.log("标签已存在");
        return res.status(400).json({ status: 1, message: "标签已存在" });
    }
    next()
}

/**
 * 验证标签id是否存在
 */
export const verifyDeleteTags = async (req, res, next) => {
    const { tagIdList  } = req.body
    if (!tagIdList.length){
        console.log("标签id列表不能为空");
        return res.status(400).json({ status: 1, message: "标签id列表不能为空" });
    }
    next()
}