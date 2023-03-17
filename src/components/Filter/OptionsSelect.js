import { Box, Chip, styled } from '@mui/material';

const StyledChip = styled(Chip)(({ theme }) => ({
  fontSize: '12px',
  '&.Mui-disabled': {
    opacity: '.80',
  },
  '&.active': {
    background: 'rgb(63,63,63)',
    color: '#fff',
    '&:hover': {
      background: 'rgb(78,78,78)',
    },
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '13px',
  },
}));

export default function OptionsSelect({
  items,
  value,
  multiple,
  onChange,
  sx,
  disabled,
  hideOnDisabled,
  disableMultiple,
}) {
  const disabledSx = {
    opacity: '.7',
  };

  let defaultSx = {};

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: {
          xl: 3,
          lg: 2,
        },
      }}
    >
      {items.map((item) => {
        const hide = !(hideOnDisabled && (disabled || item.isDisabled))
          ? false
          : multiple
          ? !value.includes(item.value)
          : item.value !== value;
        const active = multiple ? value.includes(item.value) : item.value === value;
        const isDisabled =
          disabled || item.isDisabled ? true : disableMultiple ? disableMultiple.includes(item.value) : undefined;

        defaultSx = disabled ? { ...defaultSx, ...disabledSx } : defaultSx;

        return (
          <StyledChip
            disabled={isDisabled}
            key={item.value}
            label={item.label}
            variant="contained"
            className={`${active ? 'active' : ''} ${hide ? 'd-none' : ''}`}
            sx={{ ...(sx || defaultSx) }}
            onClick={() => {
              onChange(item.value);
            }}
          />
        );
      })}
    </Box>
  );
}
