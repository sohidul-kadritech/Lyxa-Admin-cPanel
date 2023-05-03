import { Box, Stack, Typography } from '@mui/material';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';

export default function Greeting() {
  return (
    <Box>
      <Typography variant="h3" fontSize={22} lineHeight="26px">
        Good evening, Adam!
      </Typography>
      <Stack direction="row" alignItems="center" gap={6} pt={5.5}>
        <Typography
          variant="body1"
          fontWeight={600}
          lineHeight="20px"
          display="flex"
          sx={{
            alignItems: 'center',
            gap: 1,
          }}
        >
          <StarIcon />
          4.2
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          lineHeight="20px"
          display="flex"
          sx={{
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LocationIcon />
          South, Lebanon
        </Typography>
      </Stack>
    </Box>
  );
}
