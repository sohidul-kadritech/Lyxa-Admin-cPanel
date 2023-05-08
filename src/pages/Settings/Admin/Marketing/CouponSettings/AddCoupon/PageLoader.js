import { Stack } from '@mui/material';
import FormFieldSkeleton from '../../../../../../components/Skeleton/StyledFormFieldSkeleton';

export default function PageLoader() {
  return (
    <Stack
      sx={{
        width: '368px',
      }}
    >
      <FormFieldSkeleton type="input" />
      <FormFieldSkeleton type="input" />
      <FormFieldSkeleton type="input" />
      <FormFieldSkeleton type="input" />
      <FormFieldSkeleton type="input" />
      <FormFieldSkeleton type="input" />
      <FormFieldSkeleton type="input" />
    </Stack>
  );
}
