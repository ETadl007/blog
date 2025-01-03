import { http } from "@/utils/http";

export type latestNewsData = {
  code: number;
  message: string;
  data: any;
};

/** 获取最新文章数据 */
export const getlataestNewsData = () => {
  return http.request<latestNewsData>(
    "get",
    `/api/activity/latest`,
    {}
  );
};
