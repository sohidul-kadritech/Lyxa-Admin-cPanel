import { Skeleton, Stack } from '@mui/material';

function InputField({ type }) {
  return (
    <Stack
      gap={2}
      sx={{
        paddingTop: '20px',
        paddingBottom: '20px',
      }}
    >
      <Skeleton variant="rounded" height={16} width={150} />
      {type === 'input' && <Skeleton width="100%" height={50} />}
      {type === 'textarea' && <Skeleton width="100%" height={100} />}
    </Stack>
  );
}

export default function PageSkeleton() {
  return (
    <Stack
      sx={{
        width: '368px',
      }}
    >
      <InputField type="input" />
      <InputField type="input" />
      <InputField type="input" />
      <InputField type="textarea" />
      <InputField type="textarea" />
      <InputField type="input" />
    </Stack>
  );
}
