import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

export default function StyledRadioGroup({ items, color }) {
  return (
    <RadioGroup
      sx={{
        gap: '17px',
      }}
    >
      {items.map((item) => (
        <FormControlLabel
          value={item.value}
          control={<Radio color={color} />}
          label={item.label}
          sx={{
            gap: '12px',
            margin: '0',
            '& .MuiRadio-root': {
              padding: 0,
            },
            '& .MuiFormControlLabel-label': {
              fontWeight: '500',
              fontSize: '15px',
              lineHeight: '18px',
            },
          }}
        />
      ))}
    </RadioGroup>
  );
}
