import { FormControlLabel, Stack, styled } from '@mui/material';
import StyledCheckbox from './StyledCheckbox';

const StyledLabel = styled(FormControlLabel)(() => ({
  marginBottom: '0',

  '& .MuiFormControlLabel-label': {
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
  },
}));

export default function StyledCheckboxList({ items, onChange, value, readOnly, checkboxSx, ...props }) {
  return (
    <Stack>
      {items.map((option) => (
        <StyledLabel
          key={option.value}
          label={option.label}
          control={
            <StyledCheckbox
              {...props}
              checked={value.includes(option?.value)}
              onChange={() => {
                if (readOnly) {
                  return;
                }
                if (onChange) onChange(option);
              }}
              sx={{
                padding: '3px 8px',
                ...(props?.sx || {}),
              }}
            />
          }
        />
      ))}
    </Stack>
  );
}
