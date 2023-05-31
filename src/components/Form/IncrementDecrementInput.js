import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, Input, Stack, styled } from '@mui/material';

const StyledContainer = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.secondary,
  minWidth: '190px',
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
          onChange(e.target.value);
        }}
      />
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
