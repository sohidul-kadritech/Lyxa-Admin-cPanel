import SearchIcon from '@mui/icons-material/Search';
import { Input, InputAdornment, styled } from '@mui/material';

const StyledInput = styled(Input)(({ theme }) => ({
  background: '#FFFFFF',
  border: '0.5px solid #D6D6D6',
  borderRadius: '7px',
  padding: '8px 12px',

  '&::before': {
    display: 'none',
  },

  '&::after': {
    display: 'none',
  },

  '& .MuiInputBase-input': {
    color: '#828282',
    padding: '0',
    fontWeight: '500',
    fontSize: '13px',
    lineHeight: '16px',

    '&::placeholder': {
      color: '#828282!important',
      fontWeight: '500',
      fontSize: '13px',
      lineHeight: '16px',
    },

    '&::-webkit-input-placeholder': {
      color: '#828282!important',
      fontWeight: '500',
      fontSize: '13px',
      lineHeight: '16px',
    },
  },

  '& .MuiSvgIcon-root': {
    fontSize: '20px',
    marginTop: '2px',
    color: theme.palette.primary.main,
  },
}));

export default function StyledSearchBar({ ...props }) {
  return (
    <StyledInput
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      {...props}
    />
  );
}
