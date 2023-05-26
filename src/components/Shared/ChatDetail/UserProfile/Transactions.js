import { Box, Stack, Typography } from '@mui/material';
import { ReactComponent as CreditCardIcon } from '../../../../assets/icons/credit-card.svg';
import { StyledProfileBox } from './helpers';

function TransactionItem({ transaction, isFirst, isLast }) {
  return (
    <Stack
      className={`${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
      sx={{
        padding: '15px 0px',
        borderBottom: '1px solid',
        borderBottomColor: 'custom.border',

        '&.first': {
          paddingTop: '8px',
        },

        '&.last': {
          borderBottom: 'none',
          paddingBottom: '0',
        },
      }}
    >
      <Typography variant="inherit" fontWeight={500} fontSize={12} lineHeight="20px" color="text.secondary2" pb={2}>
        {transaction?.date}
      </Typography>
      <Stack direction="row" alignItems="center" gap={2}>
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            width: '34px',
            height: '34px',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#EEEEEE',
            borderRadius: '50%',
          }}
        >
          <CreditCardIcon />
        </Box>
        <Box>
          <Typography variant="inherit" fontWeight={500} fontSize="13px" lineHeight="20px">
            {transaction?.title}
          </Typography>
          <Typography variant="inherit" fontWeight={400} fontSize="11px" lineHeight="20px">
            12:10 PM
          </Typography>
        </Box>
      </Stack>
      <Typography variant="inherit" fontWeight={400} fontSize="12px" lineHeight="22px" pt={2}>
        <span style={{ fontWeight: 600 }}>Transaction ID:</span> 166461217
      </Typography>
    </Stack>
  );
}

export default function Transactions({ transactions = [] }) {
  return (
    <StyledProfileBox title="Last 5 Lyxa Pay Transactions">
      {transactions?.map((trx, index, { length }) => (
        <TransactionItem key={index} transaction={trx} isFirst={index === 0} isLast={index === length - 1} />
      ))}
    </StyledProfileBox>
  );
}
