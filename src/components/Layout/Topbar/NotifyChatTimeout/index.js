/* eslint-disable max-len */
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CloseButton from '../../../Common/CloseButton';

function DetailsCard({ children }) {
  return (
    <Box
      sx={{
        padding: '12px 20px',
        border: '1px solid',
        borderColor: 'custom.border',
        borderRadius: '7px',
        cursor: 'default',
        transition: 'background 200ms ease-in-out',

        '&:hover': {
          background: '#f0f3f6',
        },

        '&.new': {
          borderColor: '#5BBD4E',
          background: 'rgba(91, 189, 78, 0.1)',
        },
      }}
    >
      {children}
    </Box>
  );
}

function NotifyChatTimeout({ onClose, message = [] }) {
  console.log('notify', { message });

  const history = useHistory();

  const onClickHandler = () => {
    if (message?.message?._id) {
      history.push({
        pathname: '/ongoing-tickets',
        search: message?.message?.chatType === 'account' ? 'currentTab=2' : 'currentTab=1',
        state: {
          message: { ...message?.message },
        },
      });
      // ongoing
      onClose();
    }
  };
  return (
    <Paper
      sx={{
        maxWidth: 'max(55vw, 350px)',
        minWidth: 'max(55vw, 350px)',
        zIndex: '10 !important',
        maxHeight: '90vh',
        overflow: 'auto',
        background: '#fff',
        borderRadius: '12px',
        padding: '20px 25px',
      }}
    >
      <Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack
            direction="row"
            gap="16px"
            alignItems="center"
            sx={{
              background: '#fff',
              zIndex: '999',
            }}
          >
            <Typography variant="h3">There's a chat waiting for you.</Typography>
          </Stack>
          <CloseButton
            onClick={() => {
              if (onClose) onClose();
            }}
          />
        </Stack>

        <Stack gap={2} mt={2.5}>
          <DetailsCard>
            <Typography variant="body" sx={{ fontWeight: 400, fontSize: '16px' }}>
              <strong style={{ fontWeight: 700, fontSize: '16px' }}>Chat Reason:</strong>{' '}
              {message?.message?.reasonMessage}{' '}
            </Typography>
          </DetailsCard>

          <DetailsCard>
            <Typography variant="body" sx={{ fontWeight: 400, fontSize: '16px' }}>
              <strong style={{ fontWeight: 700, fontSize: '16px' }}>Status:</strong> {message?.message?.status}{' '}
            </Typography>
          </DetailsCard>

          <DetailsCard>
            <Typography variant="body" sx={{ fontWeight: 400, fontSize: '16px' }}>
              <strong style={{ fontWeight: 700, fontSize: '16px' }}>Ticket Type:</strong> {message?.message?.chatType}{' '}
            </Typography>
          </DetailsCard>

          <DetailsCard>
            <Typography variant="body" sx={{ fontWeight: 400, fontSize: '16px' }}>
              <strong style={{ fontWeight: 700, fontSize: '16px' }}>Enquiry Number:</strong> {message?.message?.shortId}{' '}
            </Typography>
          </DetailsCard>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" gap={2.5} mt={4}>
          <Button variant="outlined" size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" size="medium" onClick={onClickHandler}>
            Go
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default NotifyChatTimeout;
