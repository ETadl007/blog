// 查询片段
export const sqlFragment = {
    commentOrderNew: `
        comment.createdAt DESC
    `,
    commentOrderHot: `
        comment.thumbs_up DESC
    `
}
