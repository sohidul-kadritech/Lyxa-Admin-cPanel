import { MenuItem, OutlinedInput, Select, styled, useTheme } from '@mui/material';
import pxToRem from '../../helpers/pxToRem';

const StyledSelect = styled(Select)(({ theme }) => ({
  minHeight: 'auto',
  fontSize: `${pxToRem(12)}rem!important`,
  fontWeight: 400,
  background: theme.palette.grey[200],
  borderRadius: '50px',
  [theme.breakpoints.up('xl')]: {
    fontSize: `${pxToRem(14)}rem!important`,
  },
  '&:hover': {
    background: theme.palette.grey[300],
  },
  '& .MuiSelect-select': {
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '20px',
    paddingRight: '38px',
    borderColor: 'transparent !important',
    outline: 'none !important',
  },
  '& fieldset': {
    border: '0',
    outline: '0',
  },
}));

export default function FilterSelect({ items, placeholder, sx, ...props }) {
  const theme = useTheme();

  return (
    <StyledSelect
      MenuProps={{
        sx: {
          marginTop: '5px',
        },
      }}
      sx={sx || {}}
      displayEmpty
      input={<OutlinedInput />}
      renderValue={(value) => {
        if (!value) {
          return <em>{placeholder}</em>;
        }
        return items.find((item) => item.value === value).label;
      }}
      {...props}
    >
      {items.map((item) => (
        <MenuItem
          key={item.value}
          value={item.value}
          sx={{
            [theme.breakpoints.up('lg')]: {
              fontSize: '12px',
            },
            [theme.breakpoints.up('xl')]: {
              fontSize: '14px',
            },
          }}
        >
          {item.label}
        </MenuItem>
      ))}
    </StyledSelect>
  );
}
