// thrid party
import { Pagination, Stack } from '@mui/material';

export default function AppPagination({ paging = [], lisener, currentPage }) {
  return (
    <Stack direction="row" justifyContent="center">
      <Pagination
        color="primary"
        count={paging.length || 1}
        page={currentPage}
        onChange={(event, value) => {
          lisener(value);
        }}
        shape="rounded"
      />
    </Stack>
  );
}
