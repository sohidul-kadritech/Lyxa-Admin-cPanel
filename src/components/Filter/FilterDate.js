import { styled, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const StyledInput = styled(TextField)(({ theme }) => ({
  '.MuiOutlinedInput-input': {
    fontSize: '14px',
    paddingTop: '10px',
    paddingBottom: '10px',
    width: '77px',
  },
  '.MuiOutlinedInput-root': {
    borderRadius: '45px',
    background: theme.palette.grey[200],
    '&:hover': {
      background: theme.palette.grey[300],
    },
  },
  fieldSet: {
    border: '0',
  },
}));

export default function FilterDate({ value, onChange, ...props }) {
  return (
    <DesktopDatePicker
      value={value}
      onChange={onChange}
      {...props}
      renderInput={(params) => <StyledInput {...params} />}
    />
  );
}
