import { InputAdornment, useTheme } from '@mui/material';
import StyledInput from '../../../Styled/StyledInput';

export function CustomInputField({ inputProps, endAdornment, ...props }) {
  const theme = useTheme();
  return (
    <StyledInput
      {...props}
      {...(inputProps || {})}
      InputProps={{
        endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
      }}
      sx={{
        '& input': {
          paddingLeft: '18px',
          paddingRight: '18px',
          fontWeight: '500',
          fontSize: '15px',
          color: theme.palette.text.primary,
          ...(inputProps?.sx || {}),
        },
        ...(props?.sx || {}),
      }}
    />
  );
}
