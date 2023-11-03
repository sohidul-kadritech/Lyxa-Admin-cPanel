/* eslint-disable no-unused-vars */
import { Avatar, Box, Stack } from '@mui/material';
import React from 'react';
import { ProductOverlayTag } from '../../../../Menu/helpers';

function ProductsContainer({ product }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" gap={5} pt={3.5} pb={3.5}>
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <Avatar src={product?.images[0]} alt={product?.name} variant="rounded" sx={{ width: 66, height: 52 }}>
            {product?.name?.charAt(0)}
          </Avatar>
          {product?.status === 'inactive' && <ProductOverlayTag label="Deactivated" color="#363636" />}
          {product?.stockQuantity < 1 && product?.status === 'active' && (
            <ProductOverlayTag label="Out of Stock" color="#DD5B63" />
          )}
        </Box>
      </Stack>
    </Stack>
  );
}

export default ProductsContainer;
