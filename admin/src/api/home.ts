import { http } from "@/utils/http";

export type homeResult = {
  status: number;
  message: string;
  data: any;
};

/** 获取数据统计 用户、标签、分类、文章数 */
export const getStatistic = () => {
  return http.request<homeResult>("get", "/api/statistic", {});
};