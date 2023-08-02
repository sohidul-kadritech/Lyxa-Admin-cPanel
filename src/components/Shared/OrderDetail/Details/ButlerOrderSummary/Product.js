import { Box, styled } from '@material-ui/core';
import { Visibility } from '@mui/icons-material';
import { Avatar, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { OrderContext } from '../../OrderContext';

const ImageContainer = styled(Box)(() => ({
  width: 'auto',
  height: 'auto',
  borderRadius: '50%',
  position: 'relative',
  cursor: 'pointer',

  '& .icon': {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#cfcfcf',
    fontSize: '11px',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'rgba(0,0,0,0.35)',
    borderRadius: '50%',
    zIndex: 99,
    visibility: 'hidden',
    opacity: 0,
    transition: '200ms ease',

    '& .MuiSvgIcon-root': {
      width: '16px!important',
    },
  },

  '&:hover': {
    '& .icon': {
      visibility: 'visible',
      opacity: 1,
    },
  },
}));

export default function ButlerProduct({ product, onImagePreview }) {
  const context = useContext(OrderContext);
  const { baseCurrency } = context || {};

  console.log({ product });

  return (
    <Stack direction="row" alignItems="flex-center" gap={3}>
      <ImageContainer>
        <Avatar src={product?.productImage}>{product?.productName?.charAt(0)}</Avatar>
        <span
          className="icon"
          onClick={() => {
            onImagePreview(product?.productImage);
          }}
        >
          <Visibility />
        </span>
      </ImageContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flex={1}>
        <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={500}>
          {product?.productName}{' '}
          <span
            style={{
              fontStyle: 'italic',
            }}
          >
            x{product?.quantity}
          </span>
        </Typography>
        <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={600}>
          {baseCurrency}
          {product?.baseCurrency_totalProductAmount}
        </Typography>
      </Stack>
    </Stack>
  );
}
