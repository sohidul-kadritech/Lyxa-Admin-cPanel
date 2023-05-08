import { Box, Skeleton, Stack } from '@mui/material';

function Row() {
  return (
    <Stack gap={10} direction="row" alignItems="center">
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
      <Stack direction="row" justifyContent="flex-end">
        <Skeleton height={30} width={180} />
      </Stack>
    </Stack>
  );
}

export default function PageLoader() {
  return (
    <Stack mt={3}>
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
          <Row key={idx} />
        ))}
      </Stack>
    </Stack>
  );
}
