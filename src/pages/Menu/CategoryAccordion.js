import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as HandleIcon } from '../../assets/icons/handle.svg';
import ProductTable from './ProductTable';

export default function CategoryContainer({ category }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Accordion
      sx={{
        background: 'transparent',
        borderBottom: open ? '1px solid #EEEEEE' : null,
        '&:before': {
          display: 'none',
        },
      }}
      expanded={open}
      onChange={(e, closed) => {
        setOpen(closed);
      }}
      //   {...props}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          padding: '0',
          background: 'transparent',
          borderBottom: '1px solid #EEEEEE',
          '& .MuiSvgIcon-root': {
            color: theme.palette.text.primary,
          },
          '& .MuiAccordionSummary-content': {
            marginTop: '13px',
            marginBottom: '13px',
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap={5}>
          <HandleIcon />
          <Box>
            <Typography variant="body4" fontWeight={600} color="textPrimary" display="block" pb={2}>
              {category?.name}
            </Typography>
            <Typography variant="body4" fontWeight={600} color={theme.palette.text.secondary2} display="block">
              2 items
            </Typography>
          </Box>
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          paddingBottom: '30px',
        }}
      >
        <ProductTable products={category?.products} />
      </AccordionDetails>
    </Accordion>
  );
}
