import { Box, Skeleton, Stack } from '@mui/material';

function Column({ pageType }) {
  return (
    <Stack gap={10} direction="row" alignItems="center">
      <Stack alignItems="center" direction="row" gap={3} flex={1}>
        <Skeleton height={10} width={20} />
        {(pageType === 'list' || pageType === 'tags') && <Skeleton height={36} width={36} />}
        <Skeleton height={18} width={100} />
      </Stack>
      {pageType === 'list' && (
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
      {(pageType === 'filter' || pageType === 'list') && (
        <Stack direction="row" justifyContent="flex-end">
          <Skeleton height={10} width={30} />
        </Stack>
      )}
      {pageType === 'tags' && (
        <Stack direction="row" justifyContent="flex-end">
          <Skeleton height={30} width={180} />
        </Stack>
      )}
    </Stack>
  );
}

export default function ListPageSkeleton({ pageType }) {
  return (
    <Stack mb={11} mt={7}>
      {/* <Stack direction="row" height={35} gap={3} >
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
      </Stack> */}
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
        {pageType === 'list' ||
          (pageType === 'tags' && (
            <Skeleton
              height={20}
              sx={{
                flex: 1,
              }}
            />
          ))}
      </Stack>
      <Stack gap={5}>
        {new Array(7).fill(0).map((item, idx) => (
          <Column key={idx} pageType={pageType} />
        ))}
      </Stack>
    </Stack>
  );
}
