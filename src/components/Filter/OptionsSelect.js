import { Box, Chip, styled } from '@mui/material';

const StyledChip = styled(Chip)(({ theme }) => ({
  padding: '12px 21px',
  height: 'auto',
  width: 'auto',
  borderRadius: '35px',
  background: theme.palette.background.secondary,
  border: `1.25px solid transparent`,
  transition: 'border 200ms ease',

  '& .MuiChip-label': {
    color: theme.palette.text.primary,
    fontFamily: "'Inter', sans-serif",
    fontWeight: '500',
    fontSize: '15px',
    lineHeight: '24px',
  },

  '&:hover, &.active': {
    border: `1.25px solid ${theme.palette.primary.main}`,
    background: theme.palette.background.secondary,
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
            disableRipple
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
