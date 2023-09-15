import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { ReactComponent as DeliveryIcon } from '../../../../assets/icons/delivery-icon3.svg';
import { ReactComponent as MapIcon } from '../../../../assets/icons/map-colored.svg';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';
import CallUser from './CallUser';
import OrderTrackingMap from './OrderTracking';

// eslint-disable-next-line no-unused-vars
export function DeliveryMethod({ order = {}, theme, sx }) {
  console.log('order?.shop?.haveOwnDeliveryboy', order);
  return (
    <StyledOrderDetailBox
      sx={sx}
      title={
        <Stack
          direction="row"
          alignContent="center"
          justifyContent="space-between"
          sx={{
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            Delivery By
            <DeliveryIcon style={{ color: theme.palette.primary.main }} />
          </span>
        </Stack>
      }
    >
      <Typography variant="body2">{order?.orderFor === 'specific' ? 'Store' : 'Lyxa'}</Typography>
    </StyledOrderDetailBox>
  );
}

export default function DeliveryDetails({ order = {}, sx }) {
  const [mapOpen, setOpen] = useState(false);
  const { currentUser } = useGlobalContext();
  const { userType } = currentUser;

  const history = useHistory();
  const routeMatch = useRouteMatch();
  const theme = useTheme();

  return (
    <Stack gap={5}>
      <DeliveryMethod theme={theme} order={order} sx={sx} />
      <StyledOrderDetailBox
        sx={sx}
        title={
          <Stack
            direction="row"
            alignContent="center"
            justifyContent="space-between"
            onClick={() => setOpen(!mapOpen)}
            sx={{
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              Delivery Details
              <MapIcon />
            </span>
            <Box>{mapOpen ? <ExpandLess /> : <ExpandMore />}</Box>
          </Stack>
        }
      >
        {order?.deliveryBoy?._id && (
          <Box pt={3} pb={4}>
            <CallUser
              disableContainerStyle
              onClickName={
                userType === 'admin'
                  ? () =>
                      history.push({
                        pathname: `/riders/${order?.deliveryBoy?._id}`,
                        state: {
                          from: routeMatch?.path,
                          backToLabel: 'Back to Orders',
                        },
                      })
                  : null
              }
              user={{
                name: order?.deliveryBoy?.name,
                image: order?.deliveryBoy?.image,
                secondary: order?.orderStatus === 'delivered' ? 'Delivered' : 'Delivering',
                vehicleNumber: order?.deliveryBoy?.vehicleNumber,
                number: order?.deliveryBoy?.number,
              }}
            />
          </Box>
        )}
        {/* address details for regular orders */}
        {!order?.isButler && (
          <Box>
            <Typography variant="body2" color="textPrimary" lineHeight="22px">
              {order?.dropOffLocation?.instructions}
            </Typography>
            <Typography variant="body2" color="textPrimary" lineHeight="22px">
              {order?.dropOffLocation?.address}
            </Typography>
          </Box>
        )}
        {/* address details for butler orders */}
        {order?.isButler && (
          <Box>
            <Typography variant="body2" color="textPrimary" lineHeight="22px" pb={2}>
              {order?.dropOffLocation?.instructions}
            </Typography>
            <Typography variant="body2" color="textPrimary" lineHeight="22px" pb={2}>
              <span style={{ fontWeight: '700' }}>From -</span> {order?.pickUpLocation?.address}
            </Typography>
            <Typography variant="body2" color="textPrimary" lineHeight="22px">
              <span style={{ fontWeight: '700' }}>To -</span> {order?.dropOffLocation?.address}
            </Typography>
          </Box>
        )}
        <Accordion
          expanded={mapOpen}
          sx={{
            '&::before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary sx={{ display: 'none' }}></AccordionSummary>
          <AccordionDetails sx={{ padding: '0', paddingTop: '10px' }}>
            <OrderTrackingMap
              pickup={order?.pickUpLocation}
              dropoff={order?.dropOffLocation}
              orderType={order?.isButler ? 'butler' : order?.orderType}
            />
          </AccordionDetails>
        </Accordion>
      </StyledOrderDetailBox>
    </Stack>
  );
}
