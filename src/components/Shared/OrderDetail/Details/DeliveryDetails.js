import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as MapIcon } from '../../../../assets/icons/map-colored.svg';
import { StyledOrderDetailBox } from '../helpers';
import OrderTrackingMap from './OrderTracking';

export default function DeliveryDetails({ deliveryDetails = {}, pickUpLocation = {} }) {
  const [mapOpen, setOpen] = useState(false);
  // console.log(pickUpLocation);

  return (
    <StyledOrderDetailBox
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
      <Typography variant="body2" color="textPrimary" lineHeight="22px">
        {deliveryDetails.instructions}
      </Typography>
      <Typography variant="body2" color="textPrimary" lineHeight="22px">
        {deliveryDetails.address}
      </Typography>
      <Accordion expanded={mapOpen}>
        <AccordionSummary sx={{ display: 'none' }}></AccordionSummary>
        <AccordionDetails sx={{ padding: '0', paddingTop: '10px' }}>
          <OrderTrackingMap pickup={pickUpLocation} dropoff={deliveryDetails} />
        </AccordionDetails>
      </Accordion>
    </StyledOrderDetailBox>
  );
}
