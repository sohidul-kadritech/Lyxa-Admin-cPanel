import { Box, Skeleton, Stack } from '@mui/material';

// card
function OverviewCard() {
  return (
    <Stack
      flex={1}
      gap={5}
      sx={{
        padding: '14px 10px 10px 20px',
      }}
    >
      <Skeleton height={16} width={260} />
      <Stack direction="row" alignItems="flex-end" gap={5}>
        <Skeleton height={36} width={45} />
        <Skeleton height={20} width={120} />
      </Stack>
    </Stack>
  );
}

function CharBox() {
  return (
    <Box
      sx={{
        padding: '14px 10px 10px 20px',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
        <Skeleton height={16} width={200} />
        <Stack direction="row" gap="10px">
          <Skeleton height={30} width={180} />
          <Skeleton height={30} width={180} />
        </Stack>
      </Stack>
      <Skeleton height={325} />
    </Box>
  );
}

export default function PageSkeleton() {
  return (
    <Stack gap="30px">
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap="30px">
        <OverviewCard />
        <OverviewCard />
        <OverviewCard />
      </Stack>
      <CharBox />
      <CharBox />
    </Stack>
  );
}
