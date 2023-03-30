import { styled, TextField } from '@mui/material';
import React from 'react';

const Input = React.forwardRef(({ ...props }, ref) => <TextField {...props} ref={ref} />);

const StyledInput = styled(Input)(({ theme }) => ({
  minWidth: 'inherit',
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
}));

export default StyledInput;
