import { Box } from '@mui/material';
import { useState } from 'react';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import { useGlobalContext } from '../../../context';
import Table from './Table';

export const typeOptions = [
  { label: 'Base', value: 'baseCurrency' },
  { label: 'Secondary', value: 'secondaryCurrency' },
];

const queryParamsInit = (props) => ({
  page: 1,
  pageSize: 15,
  sortBy: 'DESC',
  orderType: 'all',
  model: 'order',
  paidCurrency: 'baseCurrency',
  ...props,
});

const dummyData = (rows) => {
  const data = [];
  for (let i = 0; i < rows; i++) {
    data.push({
      orderId: 'YJE240823000010',
      _id: i,
    });
  }

  return data;
};

export default function ButlerOrderPayoutDetailsTable() {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const [queryParams, setQueryParams] = useState(queryParamsInit({ shop: shop?._id }));

  return (
    <Box>
      <StyledTabs2
        options={typeOptions}
        value={queryParams?.paidCurrency}
        onChange={(value) => {
          setQueryParams((prev) => ({ ...prev, paidCurrency: value }));
        }}
      />
      <Table
        currencyType={queryParams?.paidCurrency}
        rows={dummyData(5)}
        page={queryParams?.page}
        setPage={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={1}
      />
    </Box>
  );
}
