import { Skeleton, Stack } from '@mui/material';

function Row() {
  return (
    <Stack direction="row" justifyContent="space-between" height={26} gap={3} mb={2} mt={1.5}>
      <Skeleton
        sx={{
          width: '200px',
        }}
      />
      <Skeleton
        sx={{
          width: '200px',
        }}
      />
      <Skeleton
        sx={{
          width: '200px',
        }}
      />
    </Stack>
  );
}

export default function UserTablePageSkeleton() {
  return (
    <Stack>
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
    </Stack>
  );
}
