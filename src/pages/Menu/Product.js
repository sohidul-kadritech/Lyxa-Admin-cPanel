import { Avatar, InputAdornment, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as HandleIcon } from '../../assets/icons/handle.svg';
import StyledInput from '../../components/Styled/StyledInput';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';

const menuItems = [
  {
    label: 'Edit item',
    value: 'edit',
  },
  {
    label: 'Go to marketing',
    value: 'marketing',
  },
  {
    label: 'Mark as sold out',
    value: 'soldOut',
  },
  {
    label: 'Deactivate',
    value: 'deactivate',
  },
  {
    label: 'Add favourite',
    value: 'favourite',
  },
];

export default function Product({ product, onMenuClick, ...props }) {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" {...props}>
      {/* left */}
      <Stack direction="row" alignItems="center" gap={5} pt={3.5} pb={3.5}>
        <HandleIcon
          className="drag-handler-chlid"
          style={{
            color: product?.isUnsortable ? '#AFAFAE' : '#363636',
            cursor: 'grap',
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
          type="number"
          min={1}
          value={product?.price}
          onChange={(e) => {
            product.price = e.target.value;
            setRender((prev) => !prev);
          }}
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
        <ThreeDotsMenu handleMenuClick={onMenuClick} menuItems={menuItems} />
      </Stack>
    </Stack>
  );
}
