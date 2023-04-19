/* eslint-disable import/no-named-as-default */
import { Add, Edit, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
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
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
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
  setEditCategory,
  isOridanryCategory,
  onProductMenuClick,
  setNewProductCategory,
  gOpen,
  fromSearch,
}) {
  const theme = useTheme();
  const shop = useSelector((store) => store.Login.admin);
  const [open, setOpen] = useState(!!category?.sortedProducts?.length);
  const [render, setRender] = useState(false);

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

  const categoriesMutation = useMutation((data) => AXIOS.post(Api.EDIT_CATEGORY, data), {
    onSuccess: (data, args) => {
      if (data?.status) {
        category.category.status = args.status;
        setRender(!render);
      }
    },
  });

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
            <Stack direction="row" alignItems="center" gap={5}>
              {shop?.shopType !== 'food' && (
                <Avatar
                  src={category?.category?.category?.image}
                  alt={category?.category?.category?.name}
                  variant="rounded"
                  sx={{ width: 66, height: 52 }}
                >
                  {category?.category?.category?.name?.charAt(0) || 'C'}
                </Avatar>
              )}
              <Box>
                <Typography variant="body4" fontWeight={600} color="textPrimary" display="block" pb={1.5}>
                  {category?.category?.name}
                </Typography>
                <Typography variant="body4" fontWeight={600} color={theme.palette.text.secondary2} display="block">
                  {isOridanryCategory ? `${category?.sortedProducts?.length} items` : '3 items (max) '}
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
            {!isOridanryCategory && (
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
            )}
            {isOridanryCategory && (
              <>
                <StyledIconButton
                  color="primary"
                  onClick={() => {
                    setEditCategory(category?.category);
                  }}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: 'inherit',
                    },
                  }}
                >
                  <Edit />
                </StyledIconButton>
                <StyledSwitch
                  checked={category?.category?.status === 'active'}
                  onChange={(e) => {
                    categoriesMutation.mutate({
                      id: category?.category?._id,
                      status: e.target.checked ? 'active' : 'inactive',
                    });
                  }}
                />
              </>
            )}
          </Stack>
        </Stack>
      </StyledAccordionSummary>
      <AccordionDetails sx={detailsSx}>
        <ProductsContainer
          products={category?.sortedProducts}
          onProductMenuClick={onProductMenuClick}
          fromSearch={fromSearch}
        />
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
