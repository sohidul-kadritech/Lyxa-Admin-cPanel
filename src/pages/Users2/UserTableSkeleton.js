import { Skeleton, Stack } from '@mui/material';

function Row() {
  return (
    <Stack direction="row" height={26} gap={3} mb={2} mt={1.5}>
      <Skeleton
        sx={{
          flex: 3,
        }}
      />
      <Skeleton
        sx={{
          flex: 5,
        }}
      />
      <Skeleton
        sx={{
          flex: 2,
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
