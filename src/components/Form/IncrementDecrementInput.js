import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, Stack, Typography, styled } from '@mui/material';

const StyledContainer = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.secondary,
  width: '160px',
  padding: '12px 0px',
  borderRadius: '30px',
}));

export default function IncrementDecrementInput({ value, onChange }) {
  return (
    <StyledContainer direction="row" justifyContent="space-between" alignItems="center">
      <Button
        disableRipple
        onClick={() => {
          onChange(Number(value) - 1);
        }}
      >
        <RemoveIcon />
      </Button>
      <Typography sx={{ fontSize: { lg: '18px', md: '16px', xs: '16px' }, fontWeight: 400, color: '#363636' }}>
        {value || 0}
      </Typography>
      <Button
        disableRipple
        onClick={() => {
          onChange(Number(value) + 1);
        }}
      >
        <AddIcon />
      </Button>
    </StyledContainer>
  );
}
