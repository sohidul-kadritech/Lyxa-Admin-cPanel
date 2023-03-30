import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { MenuItem, OutlinedInput, Select, styled, useTheme } from '@mui/material';
import pxToRem from '../../helpers/pxToRem';

const StyledSelect = styled(Select)(({ theme }) => ({
  minHeight: 'auto',
  fontSize: `${pxToRem(12)}rem!important`,
  fontWeight: 400,
  background: theme.palette.background.secondary,
  borderRadius: '50px',
  minWidth: '190px',
  [theme.breakpoints.up('xl')]: {
    fontSize: `${pxToRem(14)}rem!important`,
  },
  '&:hover': {
    background: theme.palette.background.secondaryHover,
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 500,
    color: theme.palette.text.heading,
  },
  '& .MuiSelect-select': {
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '15',
    paddingRight: '38px',
    borderColor: 'transparent !important',
    outline: 'none !important',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.heading,
  },
  '& fieldset': {
    border: '0',
    outline: '0',
  },
}));

const sizes = {
  md: {
    root: {
      '& .MuiSelect-select': {
        paddingTop: '7.5px',
        paddingBottom: '7.5px',
      },

      '& .MuiOutlinedInput-input': {
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '20px',
      },
    },
    menuSx: {
      '& .MuiMenuItem-root': {
        fontSize: '12px',
        lineHeight: '20px',
      },
    },
  },
};

export default function FilterSelect({
  items,
  plainList,
  filterName,
  placeholder,
  getValue,
  getLabel,
  getKey,
  getDisplayValue,
  size,
  sx,
  ...props
}) {
  const theme = useTheme();

  return (
    <StyledSelect
      IconComponent={KeyboardArrowDownIcon}
      MenuProps={{
        sx: {
          marginTop: '5px',
          ...(sizes[size]?.menuSx || {}),
        },
      }}
      displayEmpty
      input={<OutlinedInput />}
      renderValue={(value) => {
        if (!value) {
          return <span>{placeholder}</span>;
        }
        return (
          `${filterName || ''} ${
            getDisplayValue ? getDisplayValue(value) : items.find((item) => item.value === value)?.label
          }` || <span>{placeholder}</span>
        );
      }}
      sx={{
        ...(sizes[size]?.root || {}),
        ...(sx || {}),
      }}
      {...props}
    >
      {items.map((item) => (
        <MenuItem
          key={getKey ? getKey(item) : item.value}
          value={getValue ? getValue(item) : item.value}
          sx={{
            [theme.breakpoints.up('lg')]: {
              fontSize: '12px',
            },
            [theme.breakpoints.up('xl')]: {
              fontSize: '14px',
            },
          }}
        >
          {getLabel ? getLabel(item) : item.label}
        </MenuItem>
      ))}
    </StyledSelect>
  );
}
