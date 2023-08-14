import { Box, Skeleton, Stack, Typography } from '@mui/material';

// Order Details Handling
export function StyledProfileBox({ title, children, titleComponent }) {
  return (
    <Box
      sx={{
        border: `1px solid`,
        borderColor: 'custom.border',
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      {title && (
        <Typography variant="body4" display="block" pb={2} fontWeight={600}>
          {title}
        </Typography>
      )}
      {titleComponent && titleComponent}
      {children}
    </Box>
  );
}

export function LastOrdersSkeleton() {
  return (
    <Stack gap={2} pt={1} pb={1}>
      {new Array(5).fill(0).map((_, index) => (
        <Stack direction="row" alignItems="center" gap={3} key={index}>
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton width={200} height={14} />
        </Stack>
      ))}
    </Stack>
  );
}

export function LastTransactionsSkeleton() {
  return (
    <Stack gap={8} pt={3} pb={3}>
      {new Array(5).fill(0).map((_, index) => (
        <Stack gap={2} key={index}>
          <Skeleton width={330} height={10} />
          <Skeleton width={200} height={10} />
          <Skeleton width={140} height={10} />
        </Stack>
      ))}
    </Stack>
  );
}
