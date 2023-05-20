import { Avatar, Stack, Typography, styled } from '@mui/material';
import { ReactComponent as PhoneIcon } from '../../../assets/icons/phone.svg';
import { StyledOrderDetailBox } from './helpers';

const StyledButton = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  display: 'inline-flex',
  borderRadius: '7px',
  height: '30px',
  width: '30px',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F6F8FA',

  ':hover': {
    color: theme.palette.primary.main,
  },
}));

export default function Rider({ rider = {}, isDelivered }) {
  return (
    <StyledOrderDetailBox>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap="14px">
          <Avatar alt="rider-image" src={rider?.image} sx={{ width: 36, height: 36 }}>
            {rider?.name?.charAt(0)}
          </Avatar>
          <Stack>
            <Typography variant="body4" fontWeight={600}>
              {rider?.name}
            </Typography>
            <Typography variant="body4" fontWeight={400}>
              {isDelivered ? 'Delivered' : 'Delivering'}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" gap={4}>
          <Typography
            variant="body4"
            sx={{
              background: '#F6F8FA',
              borderRadius: '7px',
              padding: '4px 10px',
            }}
          >
            {rider?.vehicleNumber}
          </Typography>
          <StyledButton href={`tel:${rider?.number}`}>
            <PhoneIcon />
          </StyledButton>
        </Stack>
      </Stack>
    </StyledOrderDetailBox>
  );
}
