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

function Column({ pageType }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
      <Stack alignItems="center" direction="row" gap={7.5} flex={1}>
        <Skeleton height={10} width={20} />
        <Skeleton height={42} width={200} />
      </Stack>
      <Skeleton height={30} width={210} />
    </Stack>
  );
}

function SettingsBox() {
  return (
    <Stack
      sx={{
        width: {
          lg: 370,
          xs: '100%',
        },
      }}
      gap={2.5}
      justifyContent="space-between"
    >
      <Skeleton width={200} height={24} />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Skeleton width={120} height={18} />
        <Skeleton width={100} height={50} />
      </Stack>
    </Stack>
  );
}

export default function SkeletonLoader({ pageType }) {
  return (
    <Stack pt={9} gap="60px" paddingLeft={5} paddingRight={5}>
      <Stack sx={rowSx}>
        <SettingsBox />
        <SettingsBox />
      </Stack>
      <Stack sx={rowSx}>
        <SettingsBox />
        <SettingsBox />
      </Stack>
      <Stack gap={2.5}>
        <Skeleton width={200} height={24} />
        <Stack gap={3}>
          {new Array(7).fill(0).map((item, idx) => (
            <Column key={idx} pageType={pageType} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
