import { Box, Button, Stack, useTheme } from '@mui/material';
import React from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';

const inputValidation = (input) => {
  // Regular expression to match numbers in the format "123"
  const numberPattern = /^\d+$/;

  // Check if the input matches the number pattern
  if (numberPattern.test(input)) {
    return true; // Valid number
  }
  return false; // Invalid number
};

function IncrementDecrementButton({ currentValue, incrementHandler, decrementHandler, setValue, setTypeValidation }) {
  const theme = useTheme();

  const onBlurInputValueHanlder = () => {
    if (inputValidation(currentValue)) {
      return;
    }
    successMsg('Please provide valid number!');
    setValue(0);
  };
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
            disabled={currentValue <= 0}
            sx={{ fontSize: '32px', fontWeight: 600 }}
            onClick={() => {
              setTypeValidation();
              decrementHandler(setValue);
            }}
          >
            -
          </Button>
          <StyledFormField
            intputType="text"
            containerProps={{
              sx: {
                width: '50px',
                padding: '0 0',
                textAlign: 'center',
                borderRadius: '0px',
              },
            }}
            inputProps={{
              type: 'number',
              name: 'incrementdecrement',
              placeholder: 'Value',
              value: currentValue || 0,
              sx: {
                padding: '0 0',
                textAlign: 'center',
                borderRadius: '0px',
                // background: 'red',
              },
              onBlur: onBlurInputValueHanlder,
              onChange: (e) => {
                setTypeValidation();
                setValue(() => (e.target.value >= 0 ? e.target.value : 0));
              },
            }}
          />
          <Button
            disableRipple
            sx={{ fontSize: '32px', marginLeft: '0 !important' }}
            onClick={() => {
              setTypeValidation();
              incrementHandler(setValue);
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
