import { Skeleton, Stack } from '@mui/material';

function Row() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        padding: '12px',
        backgroundColor: '#bdbdbd14',
        borderRadius: '8px',
      }}
    >
      <Stack gap={3}>
        <Skeleton height={12} width={180} />
        <Skeleton height={12} width={180} />
      </Stack>
      <Stack direction="row" alignItems="center" gap={6}>
        <Skeleton height={20} width={80} />
        <Skeleton height={20} width={80} />
        <Skeleton height={20} width={80} />
      </Stack>
    </Stack>
  );
}

export default function ChatListSkeleton() {
  return (
    <Stack gap={5}>
      {new Array(5).fill(0).map((_, index) => (
        <Row key={index} />
      ))}
    </Stack>
  );
}
