export default function localDatePagination(data, cPage, pSize) {
  return data.slice((cPage - 1) * pSize, (cPage - 1) * pSize + pSize);
}
