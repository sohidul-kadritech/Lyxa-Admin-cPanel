/* eslint-disable import/no-named-as-default */
import { Add, Edit, ExpandMore } from '@mui/icons-material';
import { AccordionDetails, Avatar, Box, Button, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ProductsContainer from './ProductsContainer';
import SubCategoriesContainer from './SubCategoriesContainer';
import { StyledAccordion, StyledAccordionSummary } from './helpers';

export default function CategoryItem({
  category,
  setEditCategory,
  isOridanryCategory,
  setNewProductCategory,
  setNewSubCategoryId,
  gOpen,
  secondaryCurrency,
  asSearchResult,
  setEditFavorite,
}) {
  const theme = useTheme();
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const [open, setOpen] = useState(!!category?.sortedProducts?.length || !!category?.subCategories?.length);
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

  const product = () => {
    if (category?.sortedProducts === undefined) console.log('====>', category);
    return category?.sortedProducts || [];
  };

  return (
    <StyledAccordion
      expanded={open}
      onChange={(e, closed) => {
        setOpen(closed);
      }}
      sx={{
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
              className={`${asSearchResult ? 'cursor-not-allowed' : 'drag-handler'}`}
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
                <Stack direction="row" alignItems="center" justifyContent="start" gap={1.5} pb={1.5}>
                  {category?.category?.status === 'inactive' && (
                    <Tooltip title={shop?.shopType === 'food' ? 'Deactivated by shop' : 'Deactivated by admin'}>
                      <Box
                        sx={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#FFAB09',
                        }}
                      />
                    </Tooltip>
                  )}
                  <Typography variant="body4" fontWeight={600} color="textPrimary" display="block">
                    {category?.category?.name}
                  </Typography>
                </Stack>
                <Typography variant="body4" fontWeight={600} color={theme.palette.text.secondary2} display="block">
                  {shop?.shopType === 'food' &&
                    (isOridanryCategory ? `${category?.sortedProducts?.length} items` : '3 items (max) ')}
                  {shop?.shopType !== 'food' && `${category?.subCategories?.length} sub categories`}
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
            {/* for best seller and favorites */}
            {!isOridanryCategory && (
              <>
                {/* only for favorites */}
                {!category?.category?.isShopBestSellers && (
                  <StyledIconButton
                    color="primary"
                    onClick={() => {
                      setEditFavorite();
                    }}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        color: 'inherit',
                      },
                    }}
                  >
                    <Edit />
                  </StyledIconButton>
                )}
                <StyledSwitch
                  checked={
                    category?.category?.isShopBestSellers ? shop?.bestSeller?.isActive : shop?.shopFavourites?.isActive
                  }
                  onChange={(e) => {
                    if (category?.category?.isShopBestSellers) {
                      bestSellerMutation.mutate(e.target.checked);
                      shop.bestSeller.isActive = e.target.checked;
                    } else {
                      favouritesMutation.mutate(e.target.checked);
                      shop.shopFavourites.isActive = e.target.checked;
                    }
                  }}
                />
              </>
            )}
            {/* for ordinary categories */}
            {isOridanryCategory && shop?.shopType === 'food' && (
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
      <AccordionDetails>
        {shop?.shopType === 'food' ? (
          <ProductsContainer
            products={product()}
            secondaryCurrency={secondaryCurrency}
            asSearchResult={asSearchResult}
            isInsideFavorites={category?.category?.isShopFavorites}
            isInsideBestSellers={category?.category?.isShopBestSellers}
          />
        ) : (
          <SubCategoriesContainer
            secondaryCurrency={secondaryCurrency}
            gOpen={gOpen}
            subCategories={category?.subCategories}
            asSearchResult={asSearchResult}
          />
        )}
        {/* add product */}
        {isOridanryCategory && shop?.shopType === 'food' && category?.category?.status === 'active' && (
          <Box pl={8.5} pt={2.5} pb={2.5}>
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
        {/* add sub-category */}
        {shop?.shopType !== 'food' && category?.category?.status === 'active' && (
          <Stack pl={8.5} pt={2.5} pb={2.5} alignItems="center" direction="row" gap={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Add />}
              onClick={() => {
                setNewSubCategoryId(category?.category?.category?._id);
              }}
            >
              Add Sub-Category
            </Button>
            {category?.subCategories?.length > 0 && (
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
            )}
          </Stack>
        )}
      </AccordionDetails>
    </StyledAccordion>
  );
}
