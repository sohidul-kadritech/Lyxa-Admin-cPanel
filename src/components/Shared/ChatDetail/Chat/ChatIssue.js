import { Typography, useTheme } from '@mui/material';
import { ReactComponent as FlagIcon } from '../../../../assets/icons/order-flag.svg';
import { StyledOrderDetailBox } from '../../OrderDetail/helpers';

export default function ChatIssues({ chat }) {
  const theme = useTheme();

  console.log('chat issue', { chat });

  return (
    <StyledOrderDetailBox
      title={
        <span>
          <FlagIcon style={{ color: theme.palette.error.main, marginRight: '3px' }} /> Action Taken{' '}
          <span style={{ textTransform: 'capitalize' }}>({chat?.chatType})</span>
        </span>
      }
    >
      <Typography variant="body2" fontSize={12} lineHeight="22px" pt={1}>
        {chat?.resolvedReason?.resolveReason}
      </Typography>
    </StyledOrderDetailBox>
  );
}
