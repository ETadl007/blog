import { default as ipnet } from 'xz-ipnet';

export function randomNickname(prefix, randomLength) {
  // 兼容更低版本的默认值写法
  prefix === undefined ? (prefix = "") : prefix;
  randomLength === undefined ? (randomLength = 8) : randomLength;

  // 设置随机用户名
  // 用户名随机词典数组
  let nameArr = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    ["a", "b", "c", "d", "e", "f", "g", "h", "i", "g", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  ];
  // 随机名字字符串
  let name = prefix;
  // 循环遍历从用户词典中随机抽出一个
  for (var i = 0; i < randomLength; i++) {
    // 随机生成index
    let index = Math.floor(Math.random() * 2);
    let zm = nameArr[index][Math.floor(Math.random() * nameArr[index].length)];
    // 拼接进名字变量中
    name += zm;
  }
  // 将随机生成的名字返回
  return name;
}

export function getIpAddress(ip) {

  const ipnetInstance = ipnet();  
  const arr = ipnetInstance.find(ip);

  if (!arr || arr.length === 0) {
    return "本机地址";
  }

  return arr[1] || arr[0]
}
