// export default function localDatePagination(data, cPage, pSize) {
//   return data.slice((cPage - 1) * pSize, (cPage - 1) * pSize + pSize);
// }

export default function localDatePagination(data, cPage, pSize) {
  // Ensure positive values for current page and page size
  const currentPage = Math.max(1, cPage);
  const pageSize = Math.max(1, pSize);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Use slice to extract the portion of the array for the current page
  return data.slice(startIndex, endIndex);
}
