import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { isNumber } from 'lodash';
import React from 'react';
import StyledFormField from '../../components/Form/StyledFormField';

// endAdornment={`${newAppSettings?.secondaryCurrency?.symbol ? newAppSettings?.secondaryCurrency?.code : ''}`}

function IncrementDecrementButton({
  currentValue,
  endAdornment,
  incrementHandler,
  decrementHandler,
  setValue,
  setType,
  types,
  type,
  setTypeValidation,
  isValidateType = true,
  isChangeOthers = false,
  changeOthers,
  sx,
  objectKey,
  allowDecimal = true,
  isReadOnly = false,
}) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" gap={3}>
      <Box
        sx={{
          marginTop: '6px',
          padding: '12px 0px',
          borderRadius: '25px',
          background: theme.palette.background.secondary,
          display: 'inline-block',
          opacity: isReadOnly ? '0.5' : '1',
          ...sx,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Stack direction="row" justifyContent="center" spacing={3} alignItems="center">
            <Button
              disableRipple
              disabled={currentValue <= 0 || isReadOnly}
              sx={{ fontSize: '32px', fontWeight: 600 }}
              onClick={() => {
                if (objectKey) {
                  decrementHandler(setValue, objectKey);
                } else {
                  decrementHandler(setValue);
                }
                if (isValidateType) setTypeValidation(types, setType, type);
              }}
            >
              <RemoveIcon />
            </Button>
            <StyledFormField
              intputType="text"
              containerProps={{
                sx: {
                  width: `${currentValue?.toString().length > 0 ? currentValue.toString().length * 10 : '60'}px`,
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
                value: currentValue || 0,
                readOnly: isReadOnly,
                sx: {
                  padding: '0 0',
                  textAlign: 'center',
                  borderRadius: '0px',
                  // background: 'red',
                },
                onChange: (e) => {
                  const value = allowDecimal ? e.target.value : Math.round(Number(e?.target?.value));
                  console.log('allowDecimal', allowDecimal, value);
                  if (objectKey) {
                    if (isNumber(parseInt(value, 10)) && value < 0) setValue((prev) => ({ ...prev, [objectKey]: 0 }));
                    else setValue((prev) => ({ ...prev, [objectKey]: value }));
                  }

                  if (!objectKey) {
                    if (isNumber(parseInt(value, 10)) && value < 0) setValue(0);
                    else setValue(value);
                  }

                  if (isValidateType) setTypeValidation(types, setType, type);

                  if (isChangeOthers) changeOthers();
                },
                //   readOnly: Boolean(newProductCategory) || productReadonly,
              }}
            />
            <Button
              disableRipple
              disabled={isReadOnly}
              sx={{ fontSize: '32px', marginLeft: '0 !important' }}
              onClick={() => {
                if (objectKey) {
                  incrementHandler(setValue, objectKey);
                } else {
                  incrementHandler(setValue);
                }
                if (isValidateType) setTypeValidation(types, setType, type);
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
