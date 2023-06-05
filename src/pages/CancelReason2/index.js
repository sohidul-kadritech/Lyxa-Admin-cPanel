import { Add } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ConfirmModal from '../../components/Common/ConfirmModal';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import DateRange from '../../components/StyledCharts/DateRange';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { dateRangeInit } from '../Faq2/helpers';
import AddReason from './AddReason';
import ReasonTable from './ReasonTable';
import { statusTypeOptions } from './helper';

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

const fieldContainerSx = {
  padding: '0px 0px',
};

// eslint-disable-next-line no-unused-vars
const tabTracker = {
  0: 'userCancel',
  1: 'butler',
  2: 'shopCancel',
  3: 'admin',
};

function AddMenuButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add
    </Button>
  );
}

// cancel reason main
function CancelReason() {
  const [currentTab, setCurrentTab] = useState(0);
  const [range, setRange] = useState({ ...dateRangeInit });

  const [isEdit, setIsEdit] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const [type, setType] = useState('userCancel');
  const [status, setStatus] = useState('active');
  const [searchKey, setSearchKey] = useState('');
  const queryClient = useQueryClient();
  const [cancelReasons, setCancelReasons] = useState([]);

  const [currentCancelReason, setCurrentCancelReason] = useState({
    name: '',
    type: '',
    status: '',
  });

  const getAllcancelReason = useQuery(
    [API_URL.ALL_ORDER_CANCEL_REASON, { type, status, searchKey, startDate: range.start, endDate: range.end }],
    () =>
      AXIOS.get(API_URL.ALL_ORDER_CANCEL_REASON, {
        params: {
          type,
          status,
          searchKey,
          startDate: range.start,
          endDate: range.end,
        },
        // eslint-disable-next-line prettier/prettier
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          setCancelReasons(data?.data?.cancelReason || []);
        }
      },
      // eslint-disable-next-line prettier/prettier
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
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
            // setType(() => (newValue === 0 ? 'orderSupport' : newValue === 1 ? 'accountSupport' : 'faq'));
            // setIsSideBarOpen(false);
            setType(tabTracker[newValue]);
          }}
        >
          <Tab label="User"></Tab>
          <Tab label="Butler"></Tab>
          <Tab label="Shop"></Tab>
          <Tab label="Admin"></Tab>
        </Tabs>
      </Box>

      <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
        <DateRange range={range} setRange={setRange} />
        <StyledFormField
          intputType="select"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            name: 'status',
            placeholder: 'Status',
            value: status,
            items: statusTypeOptions,
            size: 'sm2',
            //   items: categories,
            onChange: (e) => {
              setStatus(e.target.value);
            },
          }}
        />

        <AddMenuButton
          onClick={() => {
            setOpen(() => {
              setIsEdit(false);
              return true;
            });
          }}
        />
      </Stack>

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
          reason={isEdit ? currentCancelReason : { type: tabTracker[currentTab] }}
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
