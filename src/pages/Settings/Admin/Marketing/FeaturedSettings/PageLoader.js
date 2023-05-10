/* eslint-disable no-unused-vars */
import { Skeleton, Stack } from '@mui/material';

function Row() {
  return (
    <Stack direction="row" alignItems="flex-start" gap={4}>
      <Stack direction="row" sx={{ flex: 1 }} justifyContent="space-between">
        <Skeleton height={25} variant="rounded" width={80} />
        <Skeleton height={25} variant="rounded" width={80} />
      </Stack>
      <Stack direction="row" sx={{ flex: 2 }} justifyContent="flex-end">
        <Skeleton height={25} variant="rounded" width={180} />
      </Stack>
    </Stack>
  );
}

function SettingsBox() {
  return (
    <Stack>
      <Skeleton
        height={23}
        width={120}
        sx={{
          marginBottom: 7,
        }}
      />
      <Stack gap={6}>
        <Row />
        <Row />
        <Row />
        <Row />
      </Stack>
    </Stack>
  );
}

export default function PageLoader({ pageType }) {
  return (
    <Stack pt={9} gap="60px" paddingLeft={5} paddingRight={5}>
      <SettingsBox />
      <SettingsBox />
      <SettingsBox />
    </Stack>
  );
}
