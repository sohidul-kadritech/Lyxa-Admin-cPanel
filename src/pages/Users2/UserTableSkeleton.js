import { Box, Skeleton, Stack } from '@mui/material';

function Column() {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack
        gap={5}
        direction="row"
        alignItems="center"
        sx={{
          height: '40px',
        }}
      >
        <Skeleton height={10} width={20} />
        <Box>
          <Skeleton
            height={20}
            width={100}
            sx={{
              marginBottom: 3,
            }}
          />
        </Box>
      </Stack>
      {/* <Skeleton height={40} width={120} /> */}
    </Stack>
  );
}

export default function UserTablePageSkeleton() {
  return (
    <Stack>
      <Stack direction="row" height={35} gap={3} mb={15} mt={1.5}>
        <Skeleton
          sx={{
            flex: 3,
          }}
        />
        <Skeleton
          sx={{
            width: '40px',
          }}
        />
        <Skeleton
          sx={{
            width: '70px',
          }}
        />
      </Stack>
      <Stack gap={15}>
        <Column />
        <Column />
        <Column />
        <Column />
        <Column />
        <Column />
      </Stack>
    </Stack>
  );
}
