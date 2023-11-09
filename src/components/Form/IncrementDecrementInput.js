/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, Input, Stack, Typography, styled } from '@mui/material';
import { useEffect } from 'react';

const StyledContainer = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.secondary,
  minWidth: '190px',
  padding: '12px 0px',
  borderRadius: '30px',
}));

const animationSx = (showAnimation, isUp, isDown) => {
  const template = {
    background: 'F6F8FA',
    transition: 'all 0.3s linear',
    opacity: '1',
    // transform: 'translateY(0px)',
  };

  if (showAnimation && isUp) {
    return {
      ...template,
      background: '#FFF5F8',
      color: 'red',
      opacity: '1',
    };
  }

  if (showAnimation && isDown) {
    return {
      ...template,
      background: '#FFF5F8',
      color: 'red',
      opacity: '1',
    };
  }

  return template;
};

export default function IncrementDecrementInput({
  onChange,
  onBlur,
  allowDecimal = true,
  endAdornment,
  dynamicWidth,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  value = 0,
  step = 1,
  showAnimation = false,
}) {
  const length = 190 + Math.max(value?.toString().length - 1, 0) * 8;

  useEffect(() => {
    // Function to handle mouseMove event
    const handleMouseMove = (event) => {
      // Do something with the mouse position
      const newValue = allowDecimal ? value : Math.round(Number(value));
      if (onBlur) {
        if (Number(newValue) < min) {
          onBlur(min);
        } else if (Number(newValue) > max) {
          onBlur(max);
        } else {
          onBlur(Number(newValue));
        }
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('mousemove', handleMouseMove);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [value]);

  return (
    <Stack direction="row" alignItems="center" gap={3}>
      <StyledContainer
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: dynamicWidth ? `${length}px` : '100%',
          ...(animationSx(showAnimation, value > max, value < min) || {}),
        }}
      >
        <Button
          disabled={Number(value) === min}
          disableRipple
          onClick={(e) => {
            if (Number(value) - step >= min && Number(value) - step <= max) {
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
          onBlur={(e) => {
            const value = allowDecimal ? e.target.value : Math.round(Number(e.target.value));
            if (onBlur) {
              if (Number(value) < min) {
                onBlur(min, e);
              } else if (Number(value) > max) {
                onBlur(max, e);
              } else {
                onBlur(Number(value), e);
              }
            }
          }}
          onMouseMove={(e) => {
            const newValue = allowDecimal ? value : Math.round(Number(value));
            if (onBlur) {
              if (Number(newValue) < min) {
                onBlur(min, e);
              } else if (Number(newValue) > max) {
                onBlur(max, e);
              } else {
                onBlur(Number(newValue), e);
              }
            }
          }}
          onChange={(e) => {
            const value = allowDecimal ? e?.target?.value : Math.round(Number(e?.target?.value));

            if (onChange && !onBlur) {
              if (Number(value) < min) {
                onChange(min, e);
              } else if (Number(value) > max) {
                onChange(max, e);
              } else {
                onChange(Number(value), e);
              }
            }

            if (onChange && onBlur) {
              const newValue = min > 0 ? (value > 0 ? value : 1) : 0;
              onChange(newValue, e);
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
      {endAdornment && <Typography>{endAdornment}</Typography>}
    </Stack>
  );
}
