import { Box, Stack, Typography } from '@mui/material';
import StyledInput from '../../../../../components/Styled/StyledInput';

export default function StyledBox({
  title,
  inputValue,
  inputType,
  onInputChange,
  endAdornment,
  placement,
  sx,
  sxLeft,
  sxRight,
  inputProps,
  sxContainer,
}) {
  return (
    <Stack
      direction="row"
      alignItems={placement === 'end' ? 'flex-start' : 'flex-start'}
      justifyContent={placement === 'end' ? 'flex-end' : 'flex-start'}
      sx={{
        height: '100%',
        ...sxContainer,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          maxWidth: {
            lg: '370px',
            xs: '100%',
          },
          width: {
            lg: '370px',
            xs: '100%',
          },
          ...sx,
        }}
      >
        <Box sx={{ ...sxLeft }}>
          <Typography variant="body1">{title}</Typography>
        </Box>
        <Stack direction="row" alignItems="center" gap={3} sx={{ ...sxRight }}>
          <StyledInput
            value={inputValue}
            type={inputType}
            inputProps={{
              ...inputProps,
            }}
            sx={{
              width: '120px',
              '& input': {
                textAlign: 'center',
              },
            }}
            onChange={onInputChange}
          />
          <Typography variant="body1">{endAdornment}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
