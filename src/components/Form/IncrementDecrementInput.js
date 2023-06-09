import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, Input, Stack, styled } from '@mui/material';

const StyledContainer = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.secondary,
  minWidth: '190px',
  padding: '12px 0px',
  borderRadius: '30px',
}));

export default function IncrementDecrementInput({
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
}) {
  return (
    <StyledContainer direction="row" justifyContent="space-between" alignItems="center">
      <Button
        disabled={Number(value) === min}
        disableRipple
        onClick={() => {
          if (Number(value) > min) {
            onChange(Number(value) - 1);
          }
        }}
      >
        <RemoveIcon />
      </Button>
      <Input
        sx={{
          '&::before,&::after': {
            display: 'none',
          },

          '& input': {
            textAlign: 'center',
          },
        }}
        type="number"
        value={value}
        onChange={(e) => {
          if (Number(e.target.value) < min) {
            onChange(min);
          } else if (Number(e.target.value) > max) {
            onChange(max);
          } else {
            onChange(Number(e.target.value));
          }
        }}
      />
      <Button
        disableRipple
        disabled={Number(value) === max}
        onClick={() => {
          if (Number(value) < max) {
            onChange(Number(value) + 1);
          }
        }}
      >
        <AddIcon />
      </Button>
    </StyledContainer>
  );
}
