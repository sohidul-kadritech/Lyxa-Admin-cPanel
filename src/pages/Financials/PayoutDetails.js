import { Box, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import StyledBox from '../../components/StyledCharts/StyledBox';
import DetailsAccordion from './DetailsAccordion';
import PriceItem from './PriceItem';

export default function Payout() {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);

  return (
    <Grid xs={12}>
      <StyledBox
        padding
        sx={{
          paddingBottom: '4px',
        }}
      >
        <Typography variant="body1" fontWeight={600} pb={2}>
          Payout Breakdown
        </Typography>
        <Typography variant="body4" color="#737373">
          Expected payout is scheduled on March 2, 2020. Usually, payments deposit in 1-3 business days, but the exact
          time may vary based on your bank.
        </Typography>
        <Box pt={2.5}>
          <DetailsAccordion
            title="Revenue"
            tooltip="The fees you earn depend on how your customer order and receive their order. 
            VAT inclusive"
            titleAmount="$100"
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <Stack gap={2}>
              <PriceItem title="Original Price" amount="$80" />
              <PriceItem title="Discount applied (20%)" amount="-$20" amountStatus="minus" />
            </Stack>
          </DetailsAccordion>
          <DetailsAccordion
            title="Lyxa fees"
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%. 
            VAT inclusive"
            isOpen={currentExpanedTab === 1}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 1 : -1);
            }}
          >
            <Stack gap={2}>
              <PriceItem title="10% of total order excluding delivery" amount="-$15" amountStatus="minus" />
            </Stack>
          </DetailsAccordion>

          <DetailsAccordion
            title="Other Payments"
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%. 
            VAT inclusive"
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
          >
            <Stack gap={2}>
              <PriceItem title="Promotion: free delivery (store side)" amount="-$25" amountStatus="minus" />
            </Stack>
          </DetailsAccordion>

          <DetailsAccordion
            title="Total Payout"
            titleAmount="$80"
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%. 
            VAT inclusive"
            isOpen={currentExpanedTab === 3}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 3 : -1);
            }}
            sx={{
              borderBottom: '0',
            }}
          ></DetailsAccordion>
        </Box>
      </StyledBox>
    </Grid>
  );
}
