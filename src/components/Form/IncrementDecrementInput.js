/* eslint-disable no-unsafe-optional-chaining */
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
  onChange,
  dynamicWidth,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  value = 0,
  step = 1,
}) {
  const length = 190 + Math.max(value?.toString().length - 1, 0) * 8;

  return (
    <StyledContainer
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        width: dynamicWidth ? `${length}px` : '100%',
      }}
    >
      <Button
        disabled={Number(value) === min}
        disableRipple
        onClick={(e) => {
          if (Number(value) - step >= min) {
            onChange(Number(value) - step, e);
          } else {
            onChange(min, e);
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
            onChange(min, e);
          } else if (Number(e.target.value) > max) {
            onChange(max, e);
          } else {
            onChange(Number(e.target.value), e);
          }
        }}
      />
      <Button
        disableRipple
        disabled={Number(value) === max}
        onClick={(e) => {
          if (Number(value) + step <= max) {
            onChange(Number(value) + step, e);
          } else {
            onChange(max, e);
          }
        }}
      >
        <AddIcon />
      </Button>
    </StyledContainer>
  );
}
