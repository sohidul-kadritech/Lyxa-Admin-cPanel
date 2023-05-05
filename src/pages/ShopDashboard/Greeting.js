import { Box, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
// import getCookiesAsObject from '../../helpers/cookies/getCookiesAsObject';

// let cookies;
// if (document.cookie.length) cookies = getCookiesAsObject();

// console.log(cookies);

export default function Greeting() {
  const shop = useSelector((store) => store.Login.admin);
  console.log(shop);

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
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <StarIcon />
          {shop?.rating}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          lineHeight="20px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <LocationIcon />
          {shop?.address?.address}
        </Typography>
      </Stack>
    </Box>
  );
}
