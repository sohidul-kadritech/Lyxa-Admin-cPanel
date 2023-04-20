/* eslint-disable import/no-named-as-default */
import { Edit, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import ProductsContainer from './ProductsContainer';

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
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
}));

const detailsSx = {
  paddingBottom: '30px',
  paddingLeft: '30px',
};

const accodionSx = {
  background: 'transparent',
  '&:before': {
    display: 'none',
  },
};

export default function SubCategory({ category, onProductMenuClick, gOpen, fromSearch }) {
  const [open, setOpen] = useState(!!category?.sortedProducts?.length);
  console.log(category);

  useEffect(() => {
    if (gOpen !== null) {
      setOpen(gOpen);
    }
  }, [gOpen]);

  const product = () => {
    if (category?.sortedProducts === undefined) console.log('====>', category);
    return category?.sortedProducts || [];
  };

  return (
    <Accordion
      expanded={open}
      onChange={(e, closed) => {
        setOpen(closed);
      }}
      sx={{
        ...accodionSx,
        borderBottom: open ? '1px solid #EEEEEE' : null,
        backgroundColor: '#fbfbfb',
      }}
    >
      <StyledAccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" paddingRight={6}>
          <Stack direction="row" alignItems="center" gap={5}>
            <HandleIcon
              style={{
                color: category?.category?.isUnsortable ? '#AFAFAE' : '#363636',
              }}
              className="drag-handler"
            />
            <Stack direction="row" alignItems="center" gap={5}>
              <Box>
                <Typography variant="body4" fontWeight={600} color="textPrimary" display="block" pb={1.5}>
                  {category?.sortedProducts?.name}
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            gap={5}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <>
              <StyledIconButton
                color="primary"
                onClick={() => {}}
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: 'inherit',
                  },
                }}
              >
                <Edit />
              </StyledIconButton>
              <StyledSwitch checked={category?.category?.status === 'active'} onChange={() => {}} />
            </>
          </Stack>
        </Stack>
      </StyledAccordionSummary>
      <AccordionDetails sx={detailsSx}>
        <ProductsContainer
          products={product()}
          onProductMenuClick={onProductMenuClick}
          fromSearch={fromSearch}
          isInsideFavorites={category?.category?.isShopFavorites}
          isInsideBestSellers={category?.category?.isShopBestSellers}
        />
      </AccordionDetails>
    </Accordion>
  );
}
