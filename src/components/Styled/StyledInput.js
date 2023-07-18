import { styled, TextField } from '@mui/material';
import React from 'react';

const SInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '30px',
    background: theme.palette.background.secondary,
  },
  '& fieldset': {
    outline: '0',
    border: '0',
  },
  '& input': {
    paddingTop: '12px',
    paddingBottom: '12px',
    fontWeight: '500',
  },
  // disabled
  '&:has(.MuiInputBase-root.Mui-disabled)': {
    opacity: '0.85',
  },
}));

const StyledInput = React.forwardRef(({ ...props }, ref) => (
  <SInput
    {...props}
    sx={{
      ...(props.sx || {}),
      pointerEvents: props.readOnly ? 'none' : 'initial',
    }}
    ref={ref}
  />
));

export default StyledInput;
