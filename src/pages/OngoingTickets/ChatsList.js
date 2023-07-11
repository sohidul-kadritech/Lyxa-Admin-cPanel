/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useGlobalContext } from '../../context';

function getChatCreatedAtTime(date) {
  const today = moment().startOf('day');
  const createdDate = moment(date).startOf('day');

  const diffDays = Math.floor(today.diff(createdDate, 'days'));
  const diffWeeks = Math.floor(today.diff(createdDate, 'weeks'));
  const diffMonths = Math.floor(today.diff(createdDate, 'months'));

  if (diffMonths) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  if (diffWeeks) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return `Yesterday ${moment(date).format('hh:mm:a')}`;
  if (diffDays > 1) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return `Today ${moment(date).format('hh:mm:a')}`;
}

function ChatItem({ chat, onViewDetails }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const isNewChat = chat?.status === 'pending';
  const totalOrderAmount = chat?.order?.summary?.cash + chat?.order?.summary?.wallet + chat?.order?.summary?.card || 0;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className={isNewChat ? 'new' : undefined}
      onClick={() => onViewDetails(chat)}
      sx={{
        padding: '12px 20px',
        border: '1px solid',
        borderColor: 'custom.border',
        borderRadius: '7px',
        cursor: 'pointer',
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
      <Stack gap={1}>
        <Typography variant="body4" fontWeight={600}>
          {chat?.user?.name}
        </Typography>
        <Typography variant="body4" fontWeight={400}>
          {chat?.order?.orderId}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={5}>
        {isNewChat && (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #5BBD4E',
              background: 'rgba(91, 189, 78, 0.1)',
              borderRadius: '25px',
              fontSize: '12px',
              width: '50px',
              height: '24px',
            }}
          >
            New
          </Box>
        )}
        <Typography variant="body4" fontWeight={600}>
          {currency}
          {totalOrderAmount}
        </Typography>
        <Typography variant="body4" fontWeight={400}>
          {getChatCreatedAtTime(chat?.createdAt)}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function ChatsList({ onViewDetails, chats, loading }) {
  if (loading)
    return (
      <Typography variant="body4" fontWeight={400}>
        ...Loading
      </Typography>
    );

  if (!loading && !chats?.length)
    return (
      <Typography variant="body4" fontWeight={400}>
        No chats
      </Typography>
    );

  return (
    <Stack gap={5} pb={9}>
      {chats?.map((chat) => (
        <ChatItem chat={chat} key={chat?._id} onViewDetails={onViewDetails} />
      ))}
    </Stack>
  );
}
