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
      {type === 'list' && (
        <>
          <Skeleton width="100%" height={40} />
          <Skeleton width="100%" height={40} />
          <Skeleton width="100%" height={40} />
          <Skeleton width="100%" height={40} />
        </>
      )}
    </Stack>
  );
}

export default function PageSkeleton({ isEdit }) {
  return (
    <Stack
      sx={{
        width: '368px',
      }}
    >
      {!isEdit && (
        <>
          <InputField type="input" />
          <InputField type="list" />
        </>
      )}

      {isEdit && (
        <>
          <InputField type="input" />
          <InputField type="input" />
        </>
      )}
    </Stack>
  );
}
