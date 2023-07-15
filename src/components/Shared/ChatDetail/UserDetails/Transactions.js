import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import { LastTransactionsSkeleton, StyledProfileBox } from './helpers';

const queryParamsInit = (userId) => ({
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  type: 'all',
  userId,
});

function TransactionItem({ transaction, isFirst, isLast }) {
  const sign =
    transaction?.type === 'userBalanceAddAdmin' || transaction?.type === 'userCancelOrderGetWallet'
      ? '+'
      : transaction?.type === 'userBalanceWithdrawAdmin'
      ? '-'
      : '';

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
      <Typography variant="inherit" fontWeight={400} fontSize="12px" lineHeight="22px">
        <span style={{ fontWeight: 600 }}>Amount:</span> {sign}
        {transaction?.amount}
      </Typography>
      <Typography variant="inherit" fontWeight={400} fontSize="12px" lineHeight="22px">
        <span style={{ fontWeight: 600 }}>Date:</span> {moment(transaction?.createdAt).format('ddd DD, MMM, YYYY')}
      </Typography>
      <Typography variant="inherit" fontWeight={400} fontSize="12px" lineHeight="22px">
        <span style={{ fontWeight: 600 }}>Transaction ID:</span> {transaction?.autoGenId}
      </Typography>
    </Stack>
  );
}

export default function Transactions({ userId }) {
  const [queryParams] = useState(queryParamsInit(userId));

  const query = useQuery([Api.DROP_PAY_LIST, queryParams], () =>
    AXIOS.get(Api.DROP_PAY_LIST, {
      params: queryParams,
    })
  );

  return (
    <StyledProfileBox title="Last 5 Lyxa Pay Transactions">
      {query?.isLoading && <LastTransactionsSkeleton />}
      {!query?.isLoading && (
        <Box>
          {query?.data?.data?.transactionList?.map((trx, i, { length: l }) => (
            <TransactionItem key={i} transaction={trx} isFirst={i === 0} isLast={i === l - 1} />
          ))}
        </Box>
      )}
    </StyledProfileBox>
  );
}
