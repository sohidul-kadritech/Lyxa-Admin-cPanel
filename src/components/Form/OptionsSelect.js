import { Chip, Stack, styled } from '@mui/material';

const StyledChip = styled(Chip)(() => ({
  '&.Mui-disabled': {
    opacity: '.80',
  },
  '&.active': {
    background: 'rgb(63,63,63)',
    color: '#fff',
    '&:hover': {
      background: 'rgb(154, 63, 69)',
    },
  },
}));

export default function OptionsSelect({ items, value, onChange, sx, disabled }) {
  return (
    <Stack direction="row" spacing={3}>
      {items.map((item) => (
        <StyledChip
          disabled={disabled || undefined}
          key={item.value}
          label={item.label}
          variant="contained"
          className={`${item.value === value ? 'active' : ''}`}
          sx={{ ...(sx || {}) }}
          onClick={() => {
            onChange(item.value);
          }}
        />
      ))}
    </Stack>
  );
}
