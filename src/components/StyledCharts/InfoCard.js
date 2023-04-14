import { Box, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import StyledBox from './StyledBox';

export default function InfoCard({ value, title, Tag, ...props }) {
  return (
    <Grid {...props}>
      <StyledBox>
        <Box
          sx={{
            padding: '14px 10px 10px 20px',
          }}
        >
          <Typography
            variant="h6"
            pb={4.5}
            sx={{
              lineHeight: '24px',
              fontWeight: '600',
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" alignItems="flex-end">
            <Typography
              variant="h2"
              sx={{
                lineHeight: '24px',
                fontSize: '40px !important',
              }}
            >
              {value}
            </Typography>
            {/* tag component */}
            {Tag}
          </Stack>
        </Box>
      </StyledBox>
    </Grid>
  );
}
