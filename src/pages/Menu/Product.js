/* eslint-disable no-dupe-keys */
import { Avatar, Box, InputAdornment, Stack, Typography, useTheme } from '@mui/material';
import { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { ReactComponent as HandleIcon } from '../../assets/icons/handle.svg';
import StyledInput from '../../components/Styled/StyledInput';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { ProductsContext } from './ProductContext';
import { getProductMenuOptions } from './helpers';

export default function Product({ product, onMenuClick, ...props }) {
  const { favorites, setEditProduct } = useContext(ProductsContext);

  const theme = useTheme();
  const [render, setRender] = useState(false);

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

  const stockMutation = useMutation((data) => AXIOS.post(Api.UPDATE_PRODUCT_STATUS, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
    },
  });

  const handleMenuClick = (menu) => {
    if (menu === 'visibility') {
      productMutation.mutate({
        id: product?._id,
        productVisibility: !product?.productVisibility,
        action: 'visibility',
      });
    } else if (menu === 'soldOut') {
      stockMutation.mutate({
        id: product?._id,
        stockQuantity: 0,
      });
    } else {
      onMenuClick(menu, product);
    }
  };

  const handlePriceChange = (event) => {
    product.price = event.target.value;

    productMutation.mutate({
      id: product?._id,
      price: event.target.value,
      action: 'price',
    });
  };

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
        <Avatar src={product?.images[0]} alt={product?.name} variant="rounded" sx={{ width: 66, height: 52 }} />
        <Stack gap={0.5}>
          <Typography variant="body4" fontWeight={600}>
            {product?.name}
          </Typography>
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
          onClick={(e) => {
            e.stopPropagation();
          }}
          type="number"
          min={1}
          value={product?.price}
          onChange={handlePriceChange}
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
