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
import { useEffect, useState } from 'react';
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

export default function CategoryContainer({
  category,
  isOridanryCategory,
  onProductMenuClick,
  setNewProductCategory,
  gOpen,
}) {
  const theme = useTheme();
  const shop = useSelector((store) => store.Login.admin);
  const [open, setOpen] = useState(!!category?.sortedProducts?.length);

  const bestSellerMutation = useMutation((status) =>
    AXIOS.post(Api.EDIT_SHOP_BEST_SELLER, {
      shopId: shop?._id,
      isActive: status,
    })
  );

  const favouritesMutation = useMutation((status) =>
    AXIOS.post(Api.EDIT_SHOP_FAVOVRITES, {
      shopId: shop?._id,
      isActive: status,
    })
  );

  useEffect(() => {
    if (gOpen !== null) {
      setOpen(gOpen);
    }
  }, [gOpen]);

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
                checked={category?.isShopBestSellers ? shop?.bestSeller?.isActive : shop?.shopFavourites?.isActive}
                onChange={(e) => {
                  if (category?.isShopBestSellers) {
                    bestSellerMutation.mutate(e.target.checked);
                    shop.bestSeller.isActive = e.target.checked;
                  } else {
                    favouritesMutation.mutate(e.target.checked);
                    shop.shopFavourites.isActive = e.target.checked;
                  }
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
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Add />}
              onClick={() => {
                setNewProductCategory(category?.category?.category?._id);
              }}
            >
              Add items
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
