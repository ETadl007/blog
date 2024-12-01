export function deepClone(obj: any) {
  const objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

/**
 * 图片压缩
 * @param {*} file 图片
 * @param {*} size 文件压缩至大小 但是可能压缩不到那么小
 * @param {*} quality 质量
 * @param {*} maxTime 最多压缩次数
 */
export const imageConversion = (file, size = 800, quality = 1, maxTime = 3) => {
  return new Promise((resolve: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = image.width;
        let height = image.height;

        // 确保图片长宽保持比例
        if (width > size || height > size) {
          if (width > height) {
            height = (size / width) * height;
            width = size;
          } else {
            width = (size / height) * width;
            height = size;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);

        let dataURL = canvas.toDataURL(file.type, quality);

        // 在有限时间内多次尝试压缩
        while (maxTime && quality > 0.2) {
          if (Math.round(dataURL.length) / 1024 > size) {
            maxTime--;
            quality -= 0.2;
            dataURL = canvas.toDataURL(file.type, quality);
          } else {
            break;
          }
        }

        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        // 构造一个新的 File 对象，保留原始属性
        const compressedFile = new File([u8arr], file.name, {
          type: mime,
          lastModified: file.lastModified,
        });

        resolve(compressedFile);
      };
    };
  });
};

// 时间转换
export const convertDateIfNecessary = (dateStr) => {
  // 检查是否已经是目标格式
  const targetFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (targetFormatRegex.test(dateStr)) {
    // 已经是目标格式，无需转换
    return dateStr;
  }

  // 尝试解析日期
  let date = new Date(dateStr);

  // 格式化日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};