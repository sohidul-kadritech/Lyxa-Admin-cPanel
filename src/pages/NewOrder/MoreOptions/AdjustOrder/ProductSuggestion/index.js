/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import MenuPage from '../../../../Menu';

function ProductSuggestion() {
  const [searchKey, setSearchKey] = useState('');
  return (
    <Stack>
      <MenuPage editable={false} />
    </Stack>
  );
}

export default ProductSuggestion;
