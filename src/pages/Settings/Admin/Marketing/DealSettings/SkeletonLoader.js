/* eslint-disable no-unused-vars */
import { Skeleton, Stack } from '@mui/material';

const rowSx = {
  flexDirection: {
    xs: 'column',
    lg: 'row',
  },
  alignItems: {
    lg: 'center',
    xs: 'flex-start',
  },
  justifyContent: {
    lg: 'space-between',
  },
  gap: {
    xs: '90px',
  },
};

function SettingsBox() {
  return (
    <Stack>
      <Skeleton
        height={23}
        width={120}
        sx={{
          marginBottom: 5,
        }}
      />
      <Skeleton
        height={18}
        width={180}
        sx={{
          marginBottom: 4.5,
        }}
      />
      <Stack direction="row" alignItems="flex-start" gap={4} mb={7}>
        <Skeleton height={40} variant="rounded" width={110} />
        <Skeleton height={40} variant="rounded" width={110} />
        <Skeleton height={40} variant="rounded" width={110} />
        <Skeleton height={40} variant="rounded" width={110} />
      </Stack>
      <Stack gap={4}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Skeleton height={30} variant="rounded" width={110} />
          <Skeleton height={40} variant="rounded" width={50} />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Skeleton height={30} variant="rounded" width={110} />
          <Skeleton height={40} variant="rounded" width={50} />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Skeleton height={30} variant="rounded" width={110} />
          <Skeleton height={40} variant="rounded" width={50} />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default function SkeletonLoader({ pageType }) {
  return (
    <Stack pt={9} gap="60px" paddingLeft={5} paddingRight={5}>
      <SettingsBox />
      <SettingsBox />
      <SettingsBox />
    </Stack>
  );
}
