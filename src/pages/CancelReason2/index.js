/* eslint-disable prettier/prettier */
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import ConfirmModal from '../../components/Common/ConfirmModal';
import PageTop from '../../components/Common/PageTop';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';
import { successMsg } from '../../helpers/successMsg';
import useQueryParams from '../../helpers/useQueryParams';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddReason from './AddReason';
import ReasonTable from './ReasonTable';

export const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Cancel Reason',
    to: '#',
  },
];

// const fieldContainerSx = {
//   padding: '0px 0px',
// };

// eslint-disable-next-line no-unused-vars
const tabTracker = {
  0: 'userCancel',
  1: 'butler',
  2: 'shopCancel',
  3: 'admin',
  4: 'resolve',
  5: 'subscriptionCancelReason',
};

// function AddMenuButton({ ...props }) {
//   return (
//     <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
//       Add
//     </Button>
//   );
// }

const getQueryParamsInit = () => ({
  endDate: moment().format('YYYY-MM-DD'),
  startDate: getFirstMonday('week').format('YYYY-MM-DD'),
  status: 'active',
  searchKey: '',
  type: 'userCancel',
  tab: 0,
});

// cancel reason main
function CancelReason() {
  const [queryParams, setQueryParams] = useQueryParams(getQueryParamsInit());
  // const [currentTab, setCurrentTab] = useState(0);
  // const [range, setRange] = useState({ ...dateRangeInit });

  const [isEdit, setIsEdit] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [open, setOpen] = useState(false);

  // const [type, setType] = useState('userCancel');
  // const [status, setStatus] = useState('active');
  // const [searchKey, setSearchKey] = useState('');
  const queryClient = useQueryClient();
  const [cancelReasons, setCancelReasons] = useState([]);

  const [currentCancelReason, setCurrentCancelReason] = useState({
    name: '',
    type: '',
    status: '',
  });

  const getAllcancelReason = useQuery(
    [API_URL.ALL_ORDER_CANCEL_REASON, queryParams],
    () =>
      AXIOS.get(API_URL.ALL_ORDER_CANCEL_REASON, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          setCancelReasons(data?.data?.cancelReason || []);
        }
      },
    },
  );

  const cancelReasonAdd = useMutation((data) => AXIOS.post(API_URL.ADD_ORDER_CANCEL_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Successfully deleted!', 'success');
        queryClient.invalidateQueries(API_URL.ALL_ORDER_CANCEL_REASON);
        setOpen(false);
      } else {
        successMsg('Reason not found', 'warn');
      }
    },
  });
  const cancelReasonEdit = useMutation((data) => AXIOS.post(API_URL.UPDATE_ORDER_CANCEL_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Successfully deleted!', 'success');
        queryClient.invalidateQueries(API_URL.ALL_ORDER_CANCEL_REASON);
        setOpen(false);
      } else {
        successMsg('Reason not found', 'warn');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const cancelReasonsSort = useMutation((data) => AXIOS.post(API_URL.SORT_ORDER_CANCEL_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL.ALL_ORDER_CANCEL_REASON);
      }
    },
  });

  const cancelReasonDelete = useMutation((data) => AXIOS.post(API_URL.DELETE_ORDER_CANCEL_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Successfully deleted!', 'success');
        queryClient.invalidateQueries(API_URL.ALL_ORDER_CANCEL_REASON);
        setIsConfirmModalOpen(false);
      } else {
        successMsg('Reason not found', 'warn');
      }
    },
  });

  const dropSort = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;
    const item = cancelReasons.splice(removedIndex, 1);
    cancelReasons.splice(addedIndex, 0, item[0]);
    cancelReasonsSort.mutate({
      cancelReasons: cancelReasons.map((item, index) => ({
        id: item?._id,
        sortingOrder: index + 1,
      })),
    });
  };
  const threeDotHandler = (menu, item) => {
    if (menu === 'Edit') {
      setOpen(true);
      setIsEdit(true);
      setCurrentCancelReason(item);
    } else {
      setCurrentCancelReason(item);
      setIsConfirmModalOpen(true);
    }
  };

  const submitCancelReason = (item) => {
    if (item?._id) {
      // dispatch(updateCancelReason({ ...item, id: item?._id }));
      cancelReasonEdit.mutate({ ...item, id: item?._id });
    } else {
      // dispatch(addCancelReason(item));
      cancelReasonAdd.mutate(item);
    }
  };
  return (
    <Box>
      <PageTop
        // title="Zone"
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={Number(queryParams?.tab)}
          onChange={(event, newValue) => {
            setQueryParams((prev) => ({ ...prev, tab: newValue, type: tabTracker[newValue] }));
          }}
        >
          <Tab label="User" />
          <Tab label="Butler" />
          <Tab label="Shop" />
          <Tab label="Admin" />
          <Tab label="Resolve Chat Reason" />
          <Tab label="Subscription Cancel Reason" />
        </Tabs>
      </Box>

      <Box marginBottom="30px">
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          showFilters={{
            search: true,
            status: true,
            date: true,
            button: true,
          }}
          buttonLabel="Add"
          onButtonClick={() => {
            setOpen(() => {
              setIsEdit(false);
              return true;
            });
          }}
        />
      </Box>

      <Box>
        <ReasonTable
          onDrop={dropSort}
          items={cancelReasons || []}
          threeDotHandler={threeDotHandler}
          loading={getAllcancelReason?.isLoading}
        />
      </Box>

      <Drawer open={open} anchor="right">
        <AddReason
          loading={cancelReasonAdd?.isLoading || cancelReasonEdit?.isLoading}
          isEdit={isEdit}
          reason={isEdit ? currentCancelReason : { type: tabTracker[Number(queryParams?.tab)] }}
          submitHandler={submitCancelReason}
          onClose={() => setOpen(false)}
        />
      </Drawer>
      <ConfirmModal
        message="Do you want to delete this reason ?"
        isOpen={isConfirmModalOpen}
        blurClose
        loading={cancelReasonDelete.isLoading}
        onCancel={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          // callDeleteFaq();
          cancelReasonDelete.mutate({ id: currentCancelReason?._id });
          // setIsConfirmModalOpen(false);
        }}
      />
    </Box>
  );
}

export default CancelReason;
