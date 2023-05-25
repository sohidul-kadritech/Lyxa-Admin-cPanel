import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Stack, Typography } from '@mui/material';
import { StyledProfileBox } from './helpers';

function OrderItem() {
  return (
    <Accordion
      sx={{
        '&::before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          padding: '0',
          minHeight: '0!important',

          '& .MuiAccordionSummary-content': {
            margin: '0',
          },
        }}
      >
        <Stack direction="row" alignItems="center">
          <Avatar
            alt="shop-image"
            src="https://storage.googleapis.com/dropnode/ilish-maach-bhaja-hilsa-fry-lyxa-220523101815-43.jpg"
            sx={{ width: 36, height: 36 }}
          >
            s
          </Avatar>
          <Typography variant="inherit" fontSize="13px" lineHeight="20px" fontWeight={500} pl={5} pr={1.5}>
            Roadster Diner - Zambia
          </Typography>
          <Typography variant="inherit" fontSize="11px" lineHeight="22px" color="text.secondary2">
            Delivered: May 22, 2022
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails></AccordionDetails>
    </Accordion>
  );
}

export default function LastOrder() {
  const items = new Array(4).fill(0);

  return (
    <StyledProfileBox title="Last 5 Orders">
      <Stack gap={2} pt={3.5}>
        {items?.map((e, i) => (
          <OrderItem key={i} />
        ))}
      </Stack>
    </StyledProfileBox>
  );
}
