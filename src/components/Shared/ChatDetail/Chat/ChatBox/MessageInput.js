/* eslint-disable import/no-named-as-default */
import SendIcon from '@mui/icons-material/Send';
import { Box, Stack } from '@mui/material';
import StyledFormField from '../../../../Form/StyledFormField';
import StyledIconButton from '../../../../Styled/StyledIconButton';

export default function MessageInput({ onSendMessage, value, setValue, sendMessageLoading }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        gap: '12px',
        position: 'sticky',
        bottom: '0',
        background: '#fff',
        paddingTop: '5px',
        paddingBottom: '15px',
      }}
    >
      <StyledFormField
        intputType="text"
        containerProps={{
          sx: { padding: '0', flex: 1, '& .MuiInputBase-root': { padding: '12px 18px' } },
        }}
        inputProps={{
          placeholder: 'Type your message here',
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
