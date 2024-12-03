import { http } from "@/utils/http";

export type CommentResult = {
  code: number;
  message: string;
  data: any;
};

/** 获取留言列表 */
export const getCommentList = (data?: object) => {
  return http.request<CommentResult>("post", "/api/comment/getAllComment", {
    data
  });
};

/** 删除留言 */
export const deleteComment = (data?: object) => {
  return http.request<CommentResult>("put", "/api/comment/backDelete", {
    data
  });
};
