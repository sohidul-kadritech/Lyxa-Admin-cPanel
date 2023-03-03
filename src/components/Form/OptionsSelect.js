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

export default function OptionsSelect({ items, value, onChange, sx, disabled }) {
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
    </Box>
  );
}
