import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { isNumber } from 'lodash';
import React from 'react';
import StyledFormField from '../../components/Form/StyledFormField';

function IncrementDecrementButton({
  currentValue = 0,
  endAdornment,
  incrementHandler,
  decrementHandler,
  setValue,
  setTypeValidation,
}) {
  const theme = useTheme();
  console.log(currentValue, 'current value');
  return (
    <Stack direction="row" alignItems="center" gap={3}>
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
                setTypeValidation();
                decrementHandler(setValue);
              }}
            >
              <RemoveIcon />
            </Button>
            <StyledFormField
              intputType="text"
              containerProps={{
                sx: {
                  width: `${currentValue !== null && currentValue ? currentValue.toString().length * 10 : '10'}px`,
                  padding: '0 0',
                  textAlign: 'center',
                  borderRadius: '0px',
                  marginLeft: '0px !important',
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
                onChange: (e) => {
                  setTypeValidation();
                  if (isNumber(parseInt(e.target.value, 10)) && e.target.value < 0) setValue(0);
                  else setValue(e.target.value);
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
              <AddIcon />
            </Button>
          </Stack>
        </Box>
      </Box>
      {endAdornment && <Typography>{endAdornment}</Typography>}
    </Stack>
  );
}

export default IncrementDecrementButton;
