/* eslint-disable no-unused-vars */
import { Avatar, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import FormateBaseCurrency from '../../Common/FormateBaseCurrency';
import { dealTypeToLabelMap } from './AdjustMentProduct';
import { Attributes } from './Attriubtes';
import { getProductPriceFroAdjustMent } from './helpers';

const attributeContainerSx = (open) => {
  const tempSx = {
    position: 'relative',
    top: '0px',
    width: '100%',
    opacity: 0,
    overflow: 'auto',
    maxHeight: '0px',
    pointerEvents: 'none',
    transition: 'all 0.3s linear',
    // maxHeight: '150px',
  };

  if (open) {
    delete tempSx?.visibility;
    delete tempSx?.pointerEvents;
    return { ...tempSx, top: '0px', opacity: 1, maxHeight: '250px' };
  }

  return tempSx;
};

export function ProductCard({ product, onClickProduct }) {
  const [openAttribute, setOpenAttriute] = useState(false);
  const theme = useTheme();
  return (
    <Stack
      py={1}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s linear',
        padding: '8px 20px',
        '&:hover': {
          backgroundColor: 'rgba(177, 177, 177, 0.2)',
        },
      }}
    >
      {/* products */}
      <Stack
        onClick={() => {
          if (product?.attributes?.length > 0) {
            setOpenAttriute(!openAttribute);
            return;
          }

          if (onClickProduct) onClickProduct({ product });
        }}
        direction="row"
        gap={2.5}
        alignItems="center"
      >
        <Avatar
          src={product?.images[0]}
          alt="product-image"
          sx={{
            width: '30px',
            height: '30px',
          }}
        >
          {product?.name.charAt(0).toUpperCase()}
        </Avatar>
        <Stack>
          <Stack direction="row" gap={2.5} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {product?.name}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: '14px', fontStyle: 'italic', color: 'text.secondary2' }}
            >
              {FormateBaseCurrency?.get(getProductPriceFroAdjustMent(product, product?.marketing?.type))}
            </Typography>
          </Stack>
          {product?.marketing?.type && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                lineHeight: '14px',
                fontSize: '12px',
                color: 'text.secondary2',
              }}
            >
              {dealTypeToLabelMap[product?.marketing?.type]}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack sx={{ ...attributeContainerSx(openAttribute) }} gap={2} mt={product?.attributes?.length > 0 ? 2 : 0}>
        {/* attributes */}
        {product?.attributes?.length > 0 && (
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '14px', color: 'text.secondary' }}>
            Attributes
          </Typography>
        )}
        {product?.attributes?.map((attribute, i) => (
          <Attributes
            onClickProduct={(attr) => {
              if (onClickProduct) onClickProduct({ attribute: attr, product });
            }}
            key={i}
            attribute={attribute}
          />
        ))}
      </Stack>
    </Stack>
  );
}
