export const generateGraphData = (items, getData, getLabel) => {
  const labels = [];
  const data = [];
  items.forEach((item) => {
    // labels.push();
    labels.push(getLabel(item));
    data.push(getData(item));
  });

  console.log('data===>', { labels, data });
  return { labels, data };
};
