import { styled, TextField } from '@mui/material';

const NumberInput = styled(TextField)(({ theme }) => ({
  minWidth: 'inherit',
  width: '74px',
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
    textAlign: 'center',
    fontWeight: '500',
  },
}));

export default NumberInput;
