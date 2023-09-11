import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import IncrementDecrementButton from './IncrementDecrementButton';

// eslint-disable-next-line no-unused-vars
const defaultStackStyle = {
  direction: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  sx: {
    maxWidth: {
      lg: '40%',
      xs: '100%',
    },
    width: {
      lg: '40%',
      xs: '100%',
    },
  },
};

function InputBox({
  inputProps,
  intputType,
  title,
  currentValue,
  incrementHandler,
  decrementHandler,
  setValue,
  setTypeValidation,
  endAdornment,
  stackStyle,
  titleSx,
}) {
  return (
    <Stack {...(stackStyle || defaultStackStyle)}>
      <Box>
        <Typography variant="body1" sx={{ ...(titleSx || {}) }}>
          {title}
        </Typography>
      </Box>
      {intputType !== 'incrementButton' && (
        <StyledFormField
          intputType={intputType}
          containerProps={{
            sx: {
              // width: '125px',
            },
          }}
          inputProps={inputProps}
        />
      )}

      {intputType === 'incrementButton' && (
        <IncrementDecrementButton
          currentValue={currentValue}
          incrementHandler={incrementHandler}
          decrementHandler={decrementHandler}
          setValue={setValue}
          setTypeValidation={setTypeValidation}
          endAdornment={endAdornment}
        />
      )}
      {intputType === 'status' && (
        <StyledSwitch checked={inputProps.checked} onClick={inputProps.onClick}></StyledSwitch>
      )}
    </Stack>
  );
}

export default InputBox;
