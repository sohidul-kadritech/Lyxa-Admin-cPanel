export default function dropSort(removedIndex, addedIndex, array, onSort = () => {}) {
  if (removedIndex === null || addedIndex === null) return array;
  const item = array.splice(removedIndex, 1);
  array.splice(addedIndex, 0, item[0]);
  onSort(array);
  return array;
}
