import { Box, FormControlLabel, styled } from '@mui/material';
import React from 'react';
import { ReactComponent as CheckedIcon } from '../../../assets/icons/checked-icon.svg';
import { ReactComponent as UncheckIcon } from '../../../assets/icons/uncheck-icon.svg';
import StyledCheckbox from '../../Styled/StyledCheckbox';

const StyledLabel = styled(FormControlLabel)(() => ({
  marginBottom: '0',

  '& .MuiFormControlLabel-label': {
    fontWeight: '500',
    fontSize: '15px',
    lineHeight: '24px',
  },
}));
function CustomeCheckedBox({ label, value, onChange, readOnly, sx }) {
  console.log('check', value, label);
  return (
    <Box sx={{ ...(sx || {}) }}>
      <StyledLabel
        label={label}
        control={
          <StyledCheckbox
            size="small"
            checkedIcon={<CheckedIcon />}
            icon={<UncheckIcon />}
            checked={value}
            onChange={() => {
              if (readOnly) {
                return;
              }
              if (onChange) onChange(value);
            }}
            sx={{
              padding: '3px 8px',
              borderRadius: '7px',
              color: 'primary.main',
              width: '36px',
            }}
          />
        }
      />
    </Box>
  );
}

export default CustomeCheckedBox;
