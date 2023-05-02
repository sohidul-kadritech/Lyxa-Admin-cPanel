// third party
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';

import { ReactComponent as FlagIcon } from '../../assets/icons/order-flag.svg';
import CloseButton from '../../components/Common/CloseButton';
import { StyledOrderDetailBox } from './helpers';
import OrderTimeline from './OrderTimeline';

// project import
export default function OrderDetail({ order, onClose }) {
  const theme = useTheme();

  console.log(order);

  return (
    <Box
      sx={{
        width: '400px',
        padding: '25px 20px',
      }}
    >
      <Box>
        {/* top */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={3}>
            <Avatar alt="user-image" src={order?.user?.profile_photo} sx={{ width: 36, height: 36 }}>
              {order?.user?.name[0]}
            </Avatar>
            <Stack gap={0.5}>
              <Typography variant="body4">{order?.user?.name}</Typography>
              <Typography variant="body4" color="#737373">
                9 orders
              </Typography>
            </Stack>
          </Stack>
          <CloseButton
            disableRipple
            onClick={onClose}
            sx={{
              color: theme.palette.text.primary,
            }}
          />
        </Stack>
        {/* heading */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" pt={10} pb={6.5}>
          <Typography variant="h5" fontSize={19} lineHeight="21px" fontWeight={700}>
            Order# {order?.orderId}
          </Typography>
          <Typography
            variant="h5"
            fontSize={12}
            lineHeight="20px"
            sx={{
              flexShrink: 0,
            }}
          >
            {moment(order?.createdAt).format('ddd DD, MMM, YYYY')}
          </Typography>
        </Stack>
        {/* flags */}
        <Stack gap={5}>
          <StyledOrderDetailBox
            title={
              <>
                <FlagIcon style={{ color: theme.palette.error.main, marginRight: '3px' }} /> Issue
              </>
            }
          >
            <Stack gap={1}>
              {order?.flag?.map((item) => (
                <Typography variant="body2" fontSize={14} lineHeight="22px" key={item?._id}>
                  {item?.comment}
                </Typography>
              ))}
            </Stack>
          </StyledOrderDetailBox>
          {/* order timeline */}
          <StyledOrderDetailBox title="Order Timeline">
            <OrderTimeline
              orderTimeline={order?.timeline}
              sx={{
                paddingTop: '5px',
              }}
            />
          </StyledOrderDetailBox>
        </Stack>
      </Box>
    </Box>
  );
}
