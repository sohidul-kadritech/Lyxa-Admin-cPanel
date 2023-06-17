import { Box, Button, Stack, useTheme } from '@mui/material';
import { isNumber } from 'lodash';
import React from 'react';
import StyledFormField from '../../components/Form/StyledFormField';

function IncrementDecrementButton({
  currentValue,
  incrementHandler,
  decrementHandler,
  setValue,
  setType,
  types,
  type,
  setTypeValidation,
  isValidateType = true,
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        marginTop: '6px',
        padding: '12px 0px',
        borderRadius: '25px',
        background: theme.palette.background.secondary,
        display: 'inline-block',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stack direction="row" justifyContent="center" spacing={3} alignItems="center">
          <Button
            disableRipple
            disabled={currentValue <= 0}
            sx={{ fontSize: '32px', fontWeight: 600 }}
            onClick={() => {
              decrementHandler(setValue);
              if (isValidateType) setTypeValidation(types, setType, type);
            }}
          >
            -
          </Button>
          <StyledFormField
            intputType="text"
            containerProps={{
              sx: {
                width: `${currentValue.toString().length > 0 ? currentValue.toString().length * 10 : '60'}px`,
                padding: '0 0',
                textAlign: 'center',
                borderRadius: '0px',
                marginLeft: '0 !important',
              },
            }}
            inputProps={{
              type: 'number',
              min: '0',
              name: 'incrementdecrement',
              placeholder: '0',
              value: currentValue || '',
              sx: {
                padding: '0 0',
                textAlign: 'center',
                borderRadius: '0px',
                // background: 'red',
              },
              onChange: (e) => {
                if (isNumber(parseInt(e.target.value, 10)) && e.target.value < 0) setValue(0);
                else setValue(e.target.value);
                if (isValidateType) setTypeValidation(types, setType, type);
              },
              //   readOnly: Boolean(newProductCategory) || productReadonly,
            }}
          />
          <Button
            disableRipple
            sx={{ fontSize: '32px', marginLeft: '0 !important' }}
            onClick={() => {
              incrementHandler(setValue);
              if (isValidateType) setTypeValidation(types, setType, type);
            }}
          >
            +
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default IncrementDecrementButton;
