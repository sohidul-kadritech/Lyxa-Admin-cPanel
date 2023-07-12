import { Skeleton, Stack } from '@mui/material';

function MessageItem({ sx }) {
  return (
    <Stack direction="row" sx={sx} gap={2}>
      <Skeleton height={36} width={36} variant="circular" />
      <Skeleton width={170} height={48} />
    </Stack>
  );
}

export default function MessageListSkeleton() {
  return (
    <Stack gap={8} pt={7.5} pb={7.5}>
      {new Array(7).fill(0).map((_, index) => (
        <MessageItem key={index} sx={index % 2 === 0 ? { flexDirection: 'row-reverse' } : undefined} />
      ))}
    </Stack>
  );
}
