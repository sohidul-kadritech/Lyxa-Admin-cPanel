import { Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';

export default function StyledBox({ title, children, placement, ...props }) {
  return (
    <Grid
      xs={12}
      lg={6}
      sx={{
        borderBottom: '1px dashed #E5E5E5',
        pt: 6,
        pb: 8,
      }}
      {...props}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: {
            lg: placement === 'end' ? 'flex-end' : 'flex-start',
            xs: 'flex-start',
          },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          pb={1.5}
          sx={{
            maxWidth: '370px',
            width: '370px',
            minHeight: '34px',
          }}
        >
          {title}
        </Typography>
      </Stack>
      {children}
    </Grid>
  );
}
