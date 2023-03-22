export const deepClone = (val) => {
  let value = Array.isArray(val) ? [] : {};
  try {
    value = JSON.parse(JSON.stringify(val));
    return value;
  } catch (error) {
    console.log(error);
    return Array.isArray(val) ? [] : {};
  }
};
