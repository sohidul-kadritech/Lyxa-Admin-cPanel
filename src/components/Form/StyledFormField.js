// import { FormControl, InputLabel } from '@mui/material';
import { Stack, Typography, useTheme } from '@mui/material';
import StyledInput from '../Styled/StyledInput';

export default function StyledFormField({ containerProps, label, labelProps, intputType, inputProps }) {
  const theme = useTheme();

  return (
    <Stack gap={2} {...(containerProps || {})}>
      <Typography
        variant="h5"
        {...(labelProps || {})}
        sx={{
          fontWeight: '600',
          fontSize: '15px',
          lineHeight: '18px',
          ...(labelProps?.sx || {}),
        }}
      >
        {label}
      </Typography>
      {intputType === 'text' && (
        <StyledInput
          {...(inputProps || {})}
          sx={{
            '& input': {
              paddingLeft: '18px',
              paddingRight: '18px',
              fontWeight: '500',
              fontSize: '15px',
              color: theme.palette.text.heading,
              ...(inputProps?.sx || {}),
            },
          }}
        />
      )}
    </Stack>
  );
}
