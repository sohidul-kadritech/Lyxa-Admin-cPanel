import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import IncrementDecrementButton from './IncrementDecrementButton';

function InputBox({
  inputProps,
  intputType,
  title,
  currentValue,
  incrementHandler,
  decrementHandler,
  setValue,
  setTypeValidation,
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        maxWidth: {
          lg: '40%',
          xs: '100%',
        },
        width: {
          lg: '40%',
          xs: '100%',
        },
      }}
    >
      <Box>
        <Typography variant="body1">{title}</Typography>
      </Box>
      {intputType === 'select' && (
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
        />
      )}
      {intputType === 'status' && (
        <StyledSwitch checked={inputProps.checked} onClick={inputProps.onClick}></StyledSwitch>
      )}
    </Stack>
  );
}

export default InputBox;
