import { styled, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const StyledInput = styled(TextField)(({ theme }) => ({
  '.MuiOutlinedInput-root': {
    padding: '12px 15px 12px 22px',
    maxWidth: '190px',
    borderRadius: '45px',
    background: theme.palette.background.secondary,

    '&:hover': {
      background: theme.palette.background.secondaryHover,
    },
  },

  '& .MuiInputBase-input': {
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '24px',
    padding: '0',
  },

  fieldSet: {
    border: '0',
  },
}));

const sizes = {
  md: {
    root: {
      '& .MuiInputBase-input': {
        // fontWeight: '500',
        fontSize: '12px',
        lineHeight: '20px',
      },
    },
  },
};

export default function FilterDate({ value, onChange, size, sx, ...props }) {
  return (
    <DesktopDatePicker
      value={value}
      onChange={onChange}
      {...props}
      renderInput={(params) => (
        <StyledInput
          sx={{
            ...(sizes[size]?.root || {}),
            ...(sx || {}),
          }}
          {...params}
        />
      )}
    />
  );
}
