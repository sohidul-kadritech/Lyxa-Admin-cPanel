/* eslint-disable no-unused-vars */
import { Box, Typography } from '@mui/material';
import StyledFormField from '../../../../components/Form/StyledFormField';

const TypoSx = {
  fontSize: '16px',
  fontWeight: 600,
};

export function ShopSettingsSection3({ boxSx, title, options = [], value, setValue, loading = false, setHasChanged }) {
  console.log({ value });

  return (
    <Box sx={boxSx}>
      <Typography sx={TypoSx}>{title}</Typography>
      <StyledFormField
        intputType="autocomplete"
        inputProps={{
          disabled: loading,
          readOnly: loading,
          multiple: true,
          getOptionLabel: (option) => option?.name || 'Choose',
          label: 'Choose',
          sx: {
            '& .MuiFormControl-root': {
              minWidth: '100px',
            },
          },
          maxHeight: '200px',
          options,
          value,
          isOptionEqualToValue: (option, value) => option?._id === value?._id,
          onChange: (e, v) => {
            setValue(v.map((item) => item));
            setHasChanged(true);
          },
        }}
      />
      {/* )} */}
    </Box>
  );
}
