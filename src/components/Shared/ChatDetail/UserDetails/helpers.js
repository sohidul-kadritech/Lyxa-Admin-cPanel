import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';

// Order Details Handling
export function StyledProfileBox({ title, children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      {title && (
        <Typography variant="body4" display="block" pb={2} fontWeight={600}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

export function LastOrdersSkeleton() {
  return (
    <Stack gap={3} pt={2} pb={2}>
      {new Array(5).fill(0).map((_, index) => (
        <Stack direction="row" alignItems="center" gap={3} key={index}>
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton width={200} height={14} />
        </Stack>
      ))}
    </Stack>
  );
}
