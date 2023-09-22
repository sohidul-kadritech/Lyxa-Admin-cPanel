/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { ReactComponent as ExchangeIcon } from '../../../../assets/icons/exchangeIcon.svg';
import StyledIconButton from '../../../Styled/StyledIconButton';
import SelectableItem from './SelectableItem';
import StyledContainer from './StyledContainer';

function SelectItemsToRefund() {
  const theme = useTheme();
  return (
    <Box>
      <Stack direction="row" gap={5} alignItems="center">
        <StyledContainer>
          <SelectableItem isChecked label="Delivery" price={10} />
        </StyledContainer>
        <StyledIconButton
          disableRipple
          sx={{ width: '44px', height: '44px', padding: '10px', color: 'primary.main', borderRadius: '50%!important' }}
        >
          <ExchangeIcon />
        </StyledIconButton>
        <StyledContainer>
          <SelectableItem isChecked label="Pasta" price={150} />
          <SelectableItem isChecked label="Pizza" price={150} />
          <SelectableItem isChecked label="Pizza" price={150} />
          <SelectableItem isChecked label="Pizza" price={150} />
          <Stack direction="row" justifyContent="space-between" gap={5} alignItems="center">
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '16px',
                marginLeft: '-4px',
              }}
            >
              Total
            </Typography>
            <Typography variant="body2">$ 100</Typography>
          </Stack>
        </StyledContainer>
      </Stack>
    </Box>
  );
}

export default SelectItemsToRefund;
