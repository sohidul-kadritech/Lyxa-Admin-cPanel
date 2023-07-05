import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import ProductItem from './ProductItem';

const StyledAccordion = styled(Accordion)(() => ({
  borderBottom: '1.5px solid #eee',

  '&.Mui-expanded': {
    borderColor: '#eee',
    margin: 0,
  },

  '&::before': {
    display: 'none',
  },

  '& .MuiAccordionSummary-root': {
    minHeight: '46px',
    paddingLeft: 0,
    paddingRight: 0,
  },

  '& .MuiAccordionSummary-content': {
    margin: 0,
    minHeight: '46px',
    alignItems: 'center',

    '&.Mui-expanded': {
      margin: 0,
    },
  },

  '& .MuiAccordionDetails-root': {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export default function SubCategoryItem({ subCategory }) {
  const [open, setOpen] = useState(true);
  if (!subCategory?.subCategory?.matched) return null;

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
          {subCategory?.subCategory?.name} {open ? <ExpandMore /> : <ExpandLess />}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          {subCategory?.sortedProducts?.map((product, i, { length: l }) => (
            <ProductItem product={product} key={product._id} isLast={i === l - 1} isFirst={i === 0} isCategory />
          ))}
          {!subCategory?.sortedProducts?.length && (
            <Typography variant="body2" py={3}>
              No products
            </Typography>
          )}
        </Stack>
      </AccordionDetails>
    </StyledAccordion>
  );
}
