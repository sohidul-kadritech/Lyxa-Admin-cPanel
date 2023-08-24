import { Box, Button, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import socketServices from '../../common/socketService';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';

export default function TestChat() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');

  const sendMessage = () => {
    socketServices.emit('sendMessage', { message: value });
    setValue('');
  };

  useEffect(() => {
    socketServices.on('takeMessage', (message) => {
      console.log('emited');
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketServices.removeListener('takeMessage');
    };
  }, []);

  return (
    <Box>
      <PageTop title="Test Chat" />
      <Grid container>
        <Grid>
          {/* bank name */}
          <StyledFormField
            label="Send Message"
            intputType="text"
            inputProps={{
              value,
              type: 'text',
              name: 'bank_name',
              //   onKeyup: () =>
              onChange: (e) => setValue(e.target.value),
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </Grid>
        <Grid>
          <Stack>
            {messages?.map((msg, index) => (
              <Typography key={index} variant="body1" color="initial">
                {msg?.message}
              </Typography>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
