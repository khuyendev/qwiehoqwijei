export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export async function asyncForEachMap(map, callback) {
  for (const [key, value] of Object.entries(map)) {
    await callback(map.get(key));
  }
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
export const regionOptions = [
  {
    value: "undefine",
    title: "Ko xác định"
  },
  {
    value: "en",
    title: "Tiếng Anh"
  },
  {
    value: "kor",
    title: "Tiếng Hàn"
  },
  {
    value: "cn",
    title: "Tiếng Trung Quốc"
  },
  {
    value: "vn",
    title: "Tiếng Việt"
  }
];
