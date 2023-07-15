import { Avatar, Box, Stack, Typography, styled } from '@mui/material';
import moment from 'moment';
import user2 from '../../../../../assets/images/user2.png';

const StyledMessageContainer = styled(Box)(() => ({
  '& .message-container': {
    flexDirection: 'row',
    gap: '10px',
    marginBottom: '20px',
  },

  '& .message-body': {
    background: '#eff1f3',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    maxWidth: 'calc(100% - 50px)',
  },

  '& .message-text': {
    fontSize: '12px',
    color: '#737373',
    fontWeight: '500',
    paddingBottom: '4px',
    maxWidth: '100%',
    wordWrap: 'break-word',
  },

  '& .system-message-time': {
    textAlign: 'center',
    paddingBottom: '8px',
    paddingTop: '20px',
    fontSize: '13px',
    color: '#737373',
    fontWeight: '500',
  },

  '& .message-time': {
    fontSize: '9px',
    color: '#737373',
    fontWeight: '500',
  },

  '&.system': {
    '& .message-body': {
      background: 'rgba(91, 189, 78, 0.1)',
      borderColor: '#5BBD4E',
      maxWidth: '100%',
    },

    '& .message-avatar': {
      display: 'none',
    },

    '& .message-text': {
      paddingBottom: '0',
    },
  },

  '&.user': {
    '& .message-body': {
      background: '#eff1f3',
    },
  },

  '&.admin': {
    '& .message-container': {
      flexDirection: 'row-reverse',
    },
  },
}));

export default function MessageItem({ message }) {
  let imgUrl = user2;
  let imgFallbackCharacter = 'Cs';

  if (message?.type === 'user') {
    imgUrl = message?.user?.profile_photo;
    imgFallbackCharacter = message?.user?.name?.charAt(0);
  }

  return (
    <StyledMessageContainer className={`${message?.type}`}>
      {message?.type === 'system' && (
        <Typography variant="inherit" className="system-message-time">
          {moment(message?.createdAt).format('hh:mm A, ddd DD, MMM, YYYY')}
        </Typography>
      )}
      <Stack className="message-container">
        <Avatar className="message-avatar" alt="profile-img" src={imgUrl} sx={{ width: 36, height: 36 }}>
          {imgFallbackCharacter}
        </Avatar>
        <Box className="message-body">
          <Typography variant="inherit" className="message-text">
            {message?.message}
          </Typography>
          {message?.type !== 'system' && (
            <Typography variant="inherit" className="message-time">
              {moment(message?.createdAt).format('hh:mm A, ddd DD, MMM, YYYY')}
            </Typography>
          )}
        </Box>
      </Stack>
    </StyledMessageContainer>
  );
}
