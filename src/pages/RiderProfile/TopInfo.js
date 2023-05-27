import { Avatar, Box, Stack, Typography } from '@mui/material';
import CameraIconButton from '../../components/Common/CameraIconButton';
import Rating from '../../components/Common/Rating';

function InfoItem({ text, isFirst }) {
  return (
    <Box
      className={isFirst ? 'first' : ''}
      sx={{
        paddingLeft: '12px',
        paddingRight: '12px',
        position: 'relative',

        '&::before': {
          content: "''",
          display: 'block',
          width: '5px',
          height: '5px',
          backgroundColor: 'text.secondary2',
          borderRadius: '50%',
          position: 'absolute',
          left: '0px',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        },

        '&.first': {
          paddingLeft: '0px',

          '&::before': {
            display: 'none',
          },
        },
      }}
    >
      <Typography
        variant="inherit"
        sx={{
          color: 'text.secondary2',
          fontSize: '20px',
          fontWeight: 500,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

export default function TopInfo() {
  return (
    <Stack direction="row" gap="20px">
      <Box sx={{ position: 'relative' }}>
        <Avatar alt="Shop" variant="circular" sx={{ width: 100, height: 100 }}>
          {'Nazib Talukdar'
            ?.split(' ')
            .reduce((prev, cur) => prev + cur.charAt(0), '')
            .slice(0, 3)}
        </Avatar>
        <CameraIconButton
          sx={{
            position: 'absolute',
            bottom: '0px',
            right: '-5px',
          }}
        />
      </Box>
      <Box>
        <Typography variant="h2" sx={{ fontSize: '30px', fontWeight: 500 }}>
          Nazib Talukdar
        </Typography>
        <Stack direction="row" alignItems="center" pt={2} pb={2}>
          <InfoItem text="Total income $250" isFirst />
          <InfoItem text="Balance  $150" />
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <Rating amount=" 4.2" status="positive" />
          <Typography variant="body1" color="text.secondary2">
            (100+ Reviews)
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
