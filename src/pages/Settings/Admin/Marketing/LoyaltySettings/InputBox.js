import { Stack, Typography } from '@mui/material';
import StyledInput from '../../../../../components/Styled/StyledInput';

export default function StyledBox({ title, inputValue, inputType, onInputChange, endAdornment, placement }) {
  return (
    <Stack
      direction="row"
      alignItems={placement === 'end' ? 'flex-start' : 'flex-start'}
      justifyContent={placement === 'end' ? 'flex-end' : 'flex-start'}
      sx={{
        height: '100%',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          maxWidth: '370px',
          width: '370px',
        }}
      >
        <Typography variant="body1">{title}</Typography>
        <Stack direction="row" alignItems="center" gap={3}>
          <StyledInput
            value={inputValue}
            type={inputType}
            sx={{
              width: '74px',
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
