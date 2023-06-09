import { Box, Skeleton, Stack } from '@mui/material';

function Column() {
  return (
    <Stack gap={10} direction="row" alignItems="center">
      <Stack alignItems="center" direction="row" gap={3} flex={1}>
        <Skeleton height={36} width={36} />
        <Skeleton height={18} width={100} />
      </Stack>
      <Stack alignItems="center" direction="row" gap={3} flex={1}>
        <Skeleton height={36} width={36} />
        <Skeleton height={18} width={100} />
      </Stack>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Skeleton height={18} width={100} />
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Skeleton height={18} width={100} />
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Skeleton height={18} width={100} />
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Skeleton height={18} width={100} />
      </Box>
    </Stack>
  );
}

export default function TableSkeleton() {
  return (
    <Stack mb={11} mt={7}>
      {/* table */}
      <Stack gap={10} direction="row" mb={7}>
        <Skeleton
          height={20}
          sx={{
            flex: 1,
          }}
        />
        <Skeleton
          height={20}
          sx={{
            flex: 1,
          }}
        />

        <Skeleton
          height={20}
          sx={{
            flex: 1,
          }}
        />
        <Skeleton
          height={20}
          sx={{
            flex: 1,
          }}
        />
        <Skeleton
          height={20}
          sx={{
            flex: 1,
          }}
        />
        <Skeleton
          height={20}
          sx={{
            flex: 1,
          }}
        />
      </Stack>
      <Stack gap={5}>
        {new Array(7).fill(0).map((item, idx) => (
          <Column key={idx} />
        ))}
      </Stack>
    </Stack>
  );
}
