import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import ProductItem from './ProductItem';

const StyledAccordion = styled(Accordion)(() => ({
  borderBottom: '2px solid #eee',

  '&.Mui-expanded': {
    borderColor: '#eee',
    margin: 0,
  },

  '&::before': {
    display: 'none',
  },

  '& .MuiAccordionSummary-root': {
    minHeight: '46px',
  },

  '& .MuiAccordionSummary-content': {
    margin: 0,
    minHeight: '46px',
    alignItems: 'center',
  },
}));

export default function CategoryItem({ category }) {
  const [open, setOpen] = useState(true);

  return (
    <StyledAccordion expanded={open} onChange={() => setOpen(!open)}>
      <AccordionSummary>
        <Typography
          variant="body2"
          fontSize="16px"
          color="initial"
          sx={{
            '& .MuiSvgIcon-root': {
              width: '20px',
            },
          }}
        >
          {category?.subCategory?.name} {open ? <ExpandMore /> : <ExpandLess />}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          {category?.sortedProducts?.map((product, i, { length: l }) => (
            <ProductItem product={product} key={product._id} isLast={i === l - 1} isFirst={i === 0} isCategory />
          ))}
        </Stack>
      </AccordionDetails>
    </StyledAccordion>
  );
}
