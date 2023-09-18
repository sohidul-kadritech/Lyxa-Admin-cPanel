/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Modal, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import Overview from '../../../components/Shared/FinancialsOverview';
import PayoutDetailsTable from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable';
import GlobalAddRemoveCredit from '../../../components/Shared/GlobalAddRemoveCredit';
import PayoutList from '../../../components/Shared/Payout';
import TransactionsTable from '../../../components/Shared/TransactionsTable';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MakePayment from '../../RiderProfile/Transactions/MakePayment';
import SearchBar from './Searchbar';

const amountSx = {
  fontSize: '30px!important',
};

const getTrxQueryParams = (shopId) => ({
  page: 1,
  pageSize: 5,
  shopId,
  sortBy: 'DESC',
  tnxFilter: {
    startDate: getFirstMonday('week'),
    endDate: moment(),
    type: ['adminAddBalanceShop', 'adminRemoveBalanceShop', 'adminSettlebalanceShop'],
    searchKey: '',
    amountBy: 'DESC',
    amountRange: '',
  },
});

export default function ShopTransactions({ shop }) {
  const [queryParams, setQueryParams] = useState(getTrxQueryParams(shop?._id));
  const [modalOpen, setModalOpen] = useState(false);
  const [makePayment, setMakePayment] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(0);

  const { general } = useGlobalContext();
  const storeAppSettings = general?.appSetting;
  const currency = storeAppSettings?.baseCurrency?.symbol;
  console.log('storeAppSettings', storeAppSettings);
  const queryClient = useQueryClient();

  const query = useQuery([Api.SHOP_TRX, queryParams], () => AXIOS.post(Api.SHOP_TRX, queryParams), {
    onSuccess: (data) => {
      setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
    },
  });

  const summary = query?.data?.data?.summary || {};

  console.log({ summary });

  // calculating total product amount
  const totalProductAmount = summary?.totalProductAmount || 0;
  const totalDiscount = summary?.orderValue?.totalDiscount || 0;
  const totalRewardAmount = summary?.orderValue?.totalRewardAmount || 0;
  const totalRewards = totalDiscount + totalRewardAmount;
  const totalOrderAmount = totalProductAmount - totalRewards;

  // calculating lyxa profit
  const totalDropGet = summary?.totalDropGet || 0;
  const pointsCashback = summary?.orderValue?.pointsCashback || 0;
  const lyxaProfit = totalDropGet + pointsCashback;

  useEffect(() => {
    setQueryParams(getTrxQueryParams(shop?._id));
    setTotalPage(1);
  }, [shop?._id]);

  return (
    <Box>
      <SearchBar
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        searchPlaceHolder="Search transactions"
        onMakePayment={() => {
          setMakePayment(true);
        }}
        onAddRemove={() => {
          setModalOpen(true);
        }}
      />

      <Overview
        viewUserType="admin"
        adminPaymentDetailsRange={{ start: queryParams?.tnxFilter?.startDate, end: queryParams?.tnxFilter?.endDate }}
        adminParams={{ id: shop?._id, type: 'shop' }}
      />

      <Box mb={7.5}>
        <Tabs value={currentTab}>
          <Tab onClick={() => setCurrentTab(0)} label="Transaction" />
          <Tab onClick={() => setCurrentTab(1)} label="Order" />
          <Tab onClick={() => setCurrentTab(2)} label="Payouts" />
        </Tabs>
      </Box>

      <Box mb={8}>
        {currentTab === 0 && (
          <Box>
            <TransactionsTable rows={query?.data?.data?.transections} type="transactions" loading={query?.isLoading} />
            <TablePagination
              currentPage={queryParams?.page}
              lisener={(page) => {
                setQueryParams((prev) => ({ ...prev, page }));
              }}
              totalPage={totalPage}
            />
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <PayoutDetailsTable
              startDate={queryParams?.tnxFilter?.startDate}
              endDate={queryParams?.tnxFilter?.endDate}
              shopParams={{ id: shop?._id, type: 'shop' }}
            />
          </Box>
        )}

        {currentTab === 2 && <PayoutList payaoutParams={{ shopId: shop?._id }} />}
      </Box>
      {/* add/remove credit */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Box>
          <GlobalAddRemoveCredit
            type="shop"
            data={{ ...shop }}
            onClose={() => {
              setModalOpen(false);
            }}
          />
        </Box>
      </Modal>

      <Modal
        open={makePayment}
        onClose={() => {
          setMakePayment(false);
          queryClient.invalidateQueries([Api?.SHOP_TRX]);
        }}
      >
        <Box>
          <MakePayment
            type="shop"
            id={shop?._id}
            amount={summary?.totalShopUnsettle || 0}
            onClose={() => {
              setMakePayment(false);
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
