import { Skeleton, Stack } from '@mui/material';

export default function PageSkeleton({ containerType }) {
  return (
    <Stack
      sx={{
        width: '368px',
      }}
    >
      <Stack
        gap={2}
        sx={{
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <Skeleton variant="rounded" height={16} width={150} />
        <Skeleton width="100%" height={50} />
      </Stack>
      {containerType === 'list' && (
        <>
          <Stack
            gap={2}
            sx={{
              paddingBottom: '20px',
              paddingTop: '20px',
            }}
          >
            <Skeleton variant="rounded" height={16} width={150} />
            <Skeleton width="100%" height={100} />
          </Stack>
          <Stack
            gap={2}
            sx={{
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <Skeleton variant="rounded" height={16} width={150} />
            <Skeleton width="100%" height={100} />
          </Stack>
          <Stack
            gap={2}
            sx={{
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <Skeleton variant="rounded" height={16} width={150} />
            <Stack direction="row" gap={4}>
              <Skeleton height={50} width={140} />
              <Skeleton height={50} width={140} />
              <Skeleton height={50} width={140} />
              <Skeleton height={50} width={140} />
            </Stack>
          </Stack>
          <Stack
            gap={2}
            sx={{
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <Skeleton variant="rounded" height={16} width={150} />
            <Stack direction="row" gap={4}>
              <Skeleton height={50} width={140} />
              <Skeleton height={50} width={140} />
              <Skeleton height={50} width={140} />
              <Skeleton height={50} width={140} />
            </Stack>
          </Stack>
        </>
      )}
      <Stack
        gap={2}
        sx={{
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <Skeleton variant="rounded" height={16} width={150} />
        <Stack direction="row" gap={4}>
          <Skeleton height={50} width={140} />
          <Skeleton height={50} width={140} />
          <Skeleton height={50} width={140} />
          <Skeleton height={50} width={140} />
        </Stack>
      </Stack>
    </Stack>
  );
}
