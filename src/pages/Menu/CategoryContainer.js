/* eslint-disable no-unused-vars */
import { Add, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as HandleIcon } from '../../assets/icons/handle.svg';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
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
};

const accodionSx = {
  background: 'transparent',
  '&:before': {
    display: 'none',
  },
};

export default function CategoryContainer({ category, isOridanryCategory, onProductMenuClick }) {
  const adminShop = useSelector((store) => store.Login.admin);
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const bestSellerMutation = useMutation((status) =>
    AXIOS.post(Api.EDIT_SHOP_BEST_SELLER, {
      shopId: adminShop?._id,
      isActive: status,
    })
  );

  return (
    <Accordion
      expanded={open}
      onChange={(e, closed) => {
        setOpen(closed);
      }}
      sx={{
        ...accodionSx,
        borderBottom: open ? '1px solid #EEEEEE' : null,
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
            <Box>
              <Typography variant="body4" fontWeight={600} color="textPrimary" display="block" pb={1.5}>
                {category?.category?.name}
              </Typography>
              <Typography variant="body4" fontWeight={600} color={theme.palette.text.secondary2} display="block">
                {isOridanryCategory ? `${category?.sortedProducts?.length} items` : '3 items (max) '}
              </Typography>
            </Box>
          </Stack>
          {!isOridanryCategory && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <StyledSwitch
                checked={adminShop?.bestSeller?.isActive}
                onChange={(e) => {
                  bestSellerMutation.mutate(e.target.checked);
                  adminShop.bestSeller.isActive = e.target.checked;
                }}
              />
            </Box>
          )}
        </Stack>
      </StyledAccordionSummary>
      <AccordionDetails sx={detailsSx}>
        <ProductsContainer products={category?.sortedProducts} onProductMenuClick={onProductMenuClick} />
        {isOridanryCategory && (
          <Box pl={8.5} pt={2.5}>
            <Button variant="contained" color="primary" size="small" startIcon={<Add />}>
              Add items
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
