export const replacePathValues = (path, values) => {
  let newPath = path;

  Object.keys(values).forEach((key) => {
    const regex = new RegExp(`:${key}`, 'g');
    newPath = newPath.replace(regex, values[key]);
  });

  return newPath;
};
