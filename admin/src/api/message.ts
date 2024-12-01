import { http } from "@/utils/http";

export type MessageResult = {
  status: number;
  message: string;
  data: any;
};

/** 获取留言列表 */
export const getMessageList = (data?: object) => {
  return http.request<MessageResult>("post", "/api/message/getMessageList", {
    data
  });
};

/** 删除留言 */
export const deleteMessage = (data?: object) => {
  return http.request<MessageResult>("put", "/api/message/backDelete", {
    data
  });
};
