import { Avatar, Box, Stack, Tooltip, Typography, styled } from '@mui/material';
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

  '&.admin, &.deliveryBoy': {
    '& .message-container': {
      flexDirection: 'row-reverse',
    },
  },
}));

export default function MessageItem({ message }) {
  const fallbackImage = user2;
  const fallbackName = 'Cs';
  let image;
  let name;

  if (message?.type === 'user') {
    image = message?.user?.profile_photo;
    name = message?.user?.name;
  }

  if (message?.type === 'admin') {
    image = message?.admin?.profile_photo;
    name = message?.admin?.name;
  }

  if (message?.type === 'deliveryBoy') {
    image = message?.deliveryBoy?.image;
    name = message?.deliveryBoy?.name;
  }

  return (
    <StyledMessageContainer className={`${message?.type}`}>
      {message?.type === 'system' && (
        <Typography variant="inherit" className="system-message-time">
          {moment(message?.createdAt).format('hh:mm A, ddd DD, MMM, YYYY')}
        </Typography>
      )}
      <Stack className="message-container">
        <Tooltip title={name}>
          <Avatar
            className="message-avatar"
            alt="profile-img"
            src={image || fallbackImage}
            sx={{ width: 36, height: 36 }}
          >
            {name?.charAt(0) || fallbackName?.charAt(0)}
          </Avatar>
        </Tooltip>
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
