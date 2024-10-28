import http from "@/config/request";

/** 获取留言列表 */
export const getMessageList = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/message/getMessageList", data).then((res) => {
      resolve(res);
    });
  });
};

/** 新增留言 */
export const addMessage = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/message/add", data).then((res) => {
      resolve(res);
    });
  });
};

/** 图片上传 */
/** 图片上传接口 */
export const imgUpload = async (data) => {
  // 文件压缩 太大了上传不了，我的服务器比较垃圾
  let res;
  // 没有raw.size 就表示已经压缩过了（多图片上传那里我压缩了一次） 有的话小于800不用压缩
  if (data.raw.size / 1024 > 5000) {
    const file = await imageConversion(data.raw);
    if (!file) {
      ElNotification({
        offset: 60,
        title: "错误提示",
        message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, "图片上传失败"),
      });
      return;
    } else {
      res = file;
    }
  } else {
    res = data.raw;
  }
  const formData = new FormData();
  formData.append("file", res);

  return new Promise((resolve) => {
    http
      .post("/api/upload/img", formData, {
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      })
      .then((res) => {
        resolve(res);
      });
  });
};


/** 编辑留言 */
export const updateMessage = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/message/update", data).then((res) => {
      resolve(res);
    });
  });
};

/** 删除留言 */
export const deleteMessage = (id) => {
  return new Promise((resolve, reject) => {
    http.put("/api/message/delete", { idList: [id] }).then((res) => {
      resolve(res);
    });
  });
};

/** 获取热门标签 */
export const getMessageTag = () => {
  return new Promise((resolve, reject) => {
    http.get("/api/message/getHotTagList", {}).then((res) => {
      resolve(res);
    });
  });
};
