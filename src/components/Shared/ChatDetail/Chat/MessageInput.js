/* eslint-disable import/no-named-as-default */
import SendIcon from '@mui/icons-material/Send';
import { Box, Stack } from '@mui/material';
import StyledFormField from '../../../Form/StyledFormField';
import StyledIconButton from '../../../Styled/StyledIconButton';

export default function MessageInput({ onSendMessage, value, setValue, sendMessageLoading }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap="12px" pb={4}>
      <StyledFormField
        intputType="text"
        containerProps={{
          sx: { padding: '0', flex: 1, '& .MuiInputBase-root': { padding: '12px 18px' } },
        }}
        inputProps={{
          placeHolder: 'Type your message here',
          value,
          onChange: (e) => {
            if (e.target.value.search('\n') === -1) setValue(e.target.value);
          },
          onKeyUp: (e) => {
            if (e.key === 'Enter') {
              onSendMessage();
            }
          },
          multiline: true,
        }}
      />
      <Box>
        <StyledIconButton
          disabled={sendMessageLoading}
          onClick={onSendMessage}
          sx={{
            height: '45px',
          }}
        >
          <SendIcon />
        </StyledIconButton>
      </Box>
    </Stack>
  );
}
