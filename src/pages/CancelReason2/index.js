import { Add } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../../components/Common/ConfirmModal';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import DateRange from '../../components/StyledCharts/DateRange';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import {
  addCancelReason,
  getAllCancelReasons,
  updateCancelReason,
  updateReasonStatusKey,
  updateReasonTypeKey,
} from '../../store/Settings/settingsAction';
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

// export const statusTypeOptions = [
//   {
//     value: 'active',
//     label: 'Active',
//   },
//   {
//     value: 'inactive',
//     label: 'Inactive',
//   },
// ];

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
  // eslint-disable-next-line no-unused-vars
  const [newStatus, setNewStatus] = useState('active');
  // eslint-disable-next-line no-unused-vars
  const [isEdit, setIsEdit] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { loading, cancelReasons, status, typeKey, activeStatus } = useSelector((state) => state.settingsReducer);
  // eslint-disable-next-line no-unused-vars
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [currentCancelReason, setCurrentCancelReason] = useState({
    name: '',
    type: '',
    status: '',
  });
  // const [id, setId] = useState('');

  useEffect(async () => {
    await dispatch(updateReasonTypeKey(tabTracker[currentTab]));
    await dispatch(updateReasonStatusKey(newStatus));
    if (typeKey || activeStatus) {
      dispatch(getAllCancelReasons(true));
    }
  }, [typeKey, activeStatus]);

  // eslint-disable-next-line no-unused-vars
  const submitCancelReason = (item) => {
    if (item?._id) {
      dispatch(updateCancelReason({ ...item, id: item?._id }));
    } else {
      dispatch(addCancelReason(item));
    }
  };

  // eslint-disable-next-line no-unused-vars
  const cancelReasonsSort = useMutation((data) => AXIOS.post(API_URL.SORT_ORDER_CANCEL_REASON, data));

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
  // eslint-disable-next-line no-unused-vars
  const callReasonsList = (refresh = false) => {
    dispatch(getAllCancelReasons(refresh));
  };

  const threeDotHandler = (menu, item) => {
    if (menu === 'Edit') {
      setOpen(true);
      setIsEdit(true);
      setCurrentCancelReason(item);
    } else {
      setIsConfirmModalOpen(true);
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
            dispatch(updateReasonTypeKey(tabTracker[newValue]));
          }}
        >
          <Tab label="User"></Tab>
          <Tab label="Butler"></Tab>
          <Tab label="Shop"></Tab>
          <Tab label="Admin"></Tab>
        </Tabs>
      </Box>

      <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" />
        <DateRange range={range} setRange={setRange} />
        <StyledFormField
          intputType="select"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            name: 'status',
            placeholder: 'Status',
            value: newStatus,
            items: statusTypeOptions,
            size: 'sm2',
            //   items: categories,
            onChange: (e) => {
              setNewStatus(e.target.value);
              dispatch(updateReasonStatusKey(e.target.value));
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
          loading={loading}
        />
      </Box>

      <Drawer open={open} anchor="right">
        <AddReason
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
        onCancel={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          // callDeleteFaq();
          setIsConfirmModalOpen(false);
        }}
      />
    </Box>
  );
}

export default CancelReason;
