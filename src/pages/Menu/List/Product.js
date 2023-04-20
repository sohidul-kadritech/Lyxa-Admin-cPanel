/* eslint-disable no-dupe-keys */
import { Avatar, Box, InputAdornment, Stack, Typography, useTheme } from '@mui/material';
import { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import StyledInput from '../../../components/Styled/StyledInput';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu2';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { ProductsContext } from '../ProductContext';
import { ProductOverlayTag, getProductMenuOptions, isBestSellerOrFavorite } from '../helpers';

export default function Product({ product, isInsideBestSellers, isInsideFavorites, onMenuClick, ...props }) {
  const { favorites, setEditProduct, bestSellers } = useContext(ProductsContext);

  const theme = useTheme();
  const [render, setRender] = useState(false);
  const shop = useSelector((store) => store.Login.admin);

  const productMutation = useMutation(
    (data) =>
      AXIOS.post(Api.EDIT_PRODUCT, {
        ...data,
        action: undefined,
      }),
    {
      onSuccess: (data, args) => {
        if (data?.status) {
          if (args.action === 'visibility') {
            product.productVisibility = args.productVisibility;
            successMsg(data?.message, 'success');
          }
          setRender(render);
        } else {
          successMsg(data?.message);
        }
      },
    }
  );

  const stockMutation = useMutation((data) => AXIOS.post(Api.UPDATE_PRODUCT_STOCK, data), {
    onSuccess: (data, args) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        console.log(args.stockQuantity);
        product.stockQuantity = args.stockQuantity;
        product.isStockEnabled = false;
      }
    },
  });

  const handleMenuClick = (menu) => {
    if (menu === 'visibility') {
      productMutation.mutate({
        id: product?._id,
        productVisibility: !product?.productVisibility,
        action: 'visibility',
      });
    } else if (menu === 'stock') {
      stockMutation.mutate({
        productId: product?._id,
        stockQuantity: product?.stockQuantity < 1 ? 1 : 0,
      });
    } else {
      onMenuClick(menu, product);
    }
  };

  const isBestSellerAndFavorite = isBestSellerOrFavorite(bestSellers, favorites, product);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="#fbfbfb"
      onClick={() => {
        setEditProduct(product);
      }}
      {...props}
    >
      {/* left */}
      <Stack direction="row" alignItems="center" gap={5} pt={3.5} pb={3.5}>
        <HandleIcon
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="drag-handler-chlid"
          style={{
            color: product?.isUnsortable ? '#AFAFAE' : '#363636',
            cursor: 'move',
            cursor: 'grab',
            cursor: '-webkit-grab',
          }}
        />
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <Avatar src={product?.images[0]} alt={product?.name} variant="rounded" sx={{ width: 66, height: 52 }}>
            {product?.name?.charAt(0)}
          </Avatar>
          {product.stockQuantity < 1 && <ProductOverlayTag label="Out of Stock" color="#DD5B63" />}
        </Box>
        <Stack gap={0.5}>
          <Stack direction="row" alignItems="center" justifyContent="start" gap={1.5}>
            <Typography variant="body4" fontWeight={600}>
              {product?.name}
            </Typography>
            {shop.shopType === 'food' && (
              <>
                {isBestSellerAndFavorite.isFavorite && !isInsideFavorites && (
                  <Typography variant="body4" fontWeight={600} fontStyle="italic" color="error">
                    Favourite
                  </Typography>
                )}
                {isBestSellerAndFavorite.isBestSeller && !isInsideBestSellers && (
                  <Typography
                    variant="body4"
                    fontWeight={600}
                    fontStyle="italic"
                    sx={{
                      color: '#5BBD4E',
                    }}
                  >
                    Bestseller
                  </Typography>
                )}
              </>
            )}
          </Stack>
          <Typography variant="body4" color={theme.palette.text.secondary2}>
            {`${product?.seoDescription?.slice(0, 50)}${product?.seoDescription?.length > 50 ? '...' : ''}`}
          </Typography>
          {product?.marketing?.isActive && (
            <Typography variant="body4" color={theme.palette.text.secondary2}>
              {product?.marketing?.type === 'percentage' && `${product?.discountPercentage}% discount`}
              {product?.marketing?.type === 'reward' && `${product?.rewardBundle}% points enabled `}
              {product?.marketing?.type === 'double_menu' && `Buy 1, get 1 free`}
            </Typography>
          )}
        </Stack>
      </Stack>
      {/* right */}
      <Stack direction="row" alignItems="center" gap={4}>
        <StyledInput
          type="number"
          min={1}
          value={product?.price}
          readOnly
          InputProps={{
            startAdornment: <InputAdornment position="end">$</InputAdornment>,
          }}
          sx={{
            '& .MuiInputBase-root': {
              maxWidth: '70px',
              padding: '9px 14px 9px 12px',
            },

            '& .MuiInputBase-input': {
              padding: 0,
              textAlign: 'left',
              fontSize: '14px',
            },

            '& .MuiTypography-root': {
              fontSize: '14px',
              fontWeight: '500!important',
              color: theme.palette.text.main,
            },
          }}
        />
        <Box
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ThreeDotsMenu handleMenuClick={handleMenuClick} menuItems={getProductMenuOptions(product, favorites)} />
        </Box>
      </Stack>
    </Stack>
  );
}
