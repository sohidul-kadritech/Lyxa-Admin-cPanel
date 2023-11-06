/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import MenuPage from '../../../../Menu';

function ProductSuggestion({ OnCheckProduct, suggestedProducts }) {
  const [searchKey, setSearchKey] = useState('');
  return (
    <Stack>
      <MenuPage editable={false} OnCheckProduct={OnCheckProduct} suggestedProducts={suggestedProducts} />
    </Stack>
  );
}

export default ProductSuggestion;
