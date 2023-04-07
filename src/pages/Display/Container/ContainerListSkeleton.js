import { Box, Skeleton, Stack } from '@mui/material';

function Column({ containerType }) {
  return (
    <Stack gap={10} direction="row" alignItems="center">
      <Stack alignItems="center" direction="row" gap={3} flex={1}>
        <Skeleton height={10} width={20} />
        {containerType === 'list' && <Skeleton height={36} width={36} />}
        <Skeleton height={18} width={100} />
      </Stack>
      {containerType === 'list' && (
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Skeleton height={18} width={100} />
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
        }}
      >
        <Skeleton height={40} width={100} />
      </Box>
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Skeleton height={18} width={100} />
      </Box>
      <Stack direction="row" justifyContent="flex-end">
        <Skeleton height={10} width={30} />
      </Stack>
    </Stack>
  );
}

export default function ContainerListSkeleton({ containerType }) {
  return (
    <Stack>
      <Stack height={40} direction="row" gap={1.5} mt={5} mb={6}>
        <Skeleton width={90} />
        <Skeleton width={90} />
        <Skeleton width={90} />
      </Stack>
      <Stack direction="row" height={35} gap={3} mb={11}>
        <Skeleton
          sx={{
            flex: 3,
          }}
        />
        <Skeleton
          sx={{
            flex: 1,
          }}
        />
        <Skeleton
          sx={{
            flex: 1,
          }}
        />
        <Skeleton
          sx={{
            flex: 1,
          }}
        />
      </Stack>
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
        {containerType === 'list' && (
          <Skeleton
            height={20}
            sx={{
              flex: 1,
            }}
          />
        )}
      </Stack>
      <Stack gap={5}>
        {new Array(7).fill(0).map((item, idx) => (
          <Column key={idx} containerType={containerType} />
        ))}
      </Stack>
    </Stack>
  );
}
