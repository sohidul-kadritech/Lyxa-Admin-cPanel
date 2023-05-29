import { Box, Button, Stack, useTheme } from '@mui/material';
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
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        marginTop: '6px',
        padding: '20px 0px',
        borderRadius: '25px',
        background: theme.palette.background.secondary,
        display: 'inline-block',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stack direction="row" justifyContent="center" spacing={3} alignItems="center">
          <Button
            disableRipple
            sx={{ fontSize: '32px', fontWeight: 600 }}
            onClick={() => {
              decrementHandler(setValue);
              setTypeValidation(types, setType, type);
            }}
          >
            -
          </Button>
          <StyledFormField
            intputType="text"
            containerProps={{
              sx: {
                width: '120px',
                padding: '0 0',
                textAlign: 'center',
                borderRadius: '0px',
              },
            }}
            inputProps={{
              type: 'number',
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
                setValue(e.target.value);
                setTypeValidation(types, setType, type);
              },
              //   readOnly: Boolean(newProductCategory) || productReadonly,
            }}
          />
          <Button
            disableRipple
            sx={{ fontSize: '32px', marginLeft: '0 !important' }}
            onClick={() => {
              incrementHandler(setValue);
              setTypeValidation(types, setType, type);
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
