import { Add } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
// eslint-disable-next-line import/order, no-unused-vars
import DateRange from '../../components/StyledCharts/DateRange';
import { createUpdateData, dateRangeInit, statusTypeOptions } from './helpers';

import ConfirmModal from '../../components/Common/ConfirmModal';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddFaq from './AddFaq';
import FaqTable from './FaqTable';

// faq validation
const queryValidation = (item) => {
  switch (false) {
    case Boolean(item?.type):
      successMsg('Q&A type cannot be empty');
      return false;

    case Boolean(item?.ans?.trim() || item?.answer?.trim()):
      successMsg('Q&A answer cannot be empty');
      return false;

    case Boolean(item?.question?.trim()):
      successMsg('Q&A question cannot be empty');
      return false;

    default:
      return true;
  }
};

const fieldContainerSx = {
  padding: '0px 0px',
};

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Support Reasons',
    to: '#',
  },
];

export function AddMenuButton({ title = 'Add', ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      {title}
    </Button>
  );
}

function Faq() {
  const queryClient = useQueryClient();

  const [range, setRange] = useState({ ...dateRangeInit });

  const [currentTab, setCurrentTab] = useState(0);

  const [currentFaq, setCurrentFaq] = useState({});

  const [deleteFaqData, setDeletedFaqData] = useState({});

  const [searchKey, setSearchKey] = useState('');

  const [dataCounter, setDataCounter] = useState({
    orderSupport: 0,
    accountSupport: 0,
    faq: 0,
  });
  const [type, setType] = useState('orderSupport');

  const [status, setStatus] = useState('active');

  const [isEdit, setIsEdit] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [open, setOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const getChatReason = useQuery([API_URL?.GET_CHAT_REASON, { status, type, searchKey, range }], () =>
    AXIOS.get(API_URL?.GET_CHAT_REASON, {
      params: {
        status,
        type,
        searchKey,
        startDate: range.start,
        endDate: range.end,
      },
      // eslint-disable-next-line prettier/prettier
    })
  );

  // eslint-disable-next-line no-unused-vars
  const getChatFaq = useQuery([API_URL?.GET_FAQ, { status, searchKey, range }], () =>
    AXIOS.get(API_URL?.GET_FAQ, {
      params: {
        status,
        searchKey,
        startDate: range.start,
        endDate: range.end,
      },
      // eslint-disable-next-line prettier/prettier
    })
  );

  const faqSortQuery = useMutation((data) => AXIOS.post(API_URL.SORT_FAQ, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL?.GET_FAQ);
      }
    },
  });
  // eslint-disable-next-line no-unused-vars
  const faqAddQuery = useMutation((data) => AXIOS.post(API_URL.ADD_FAQ, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg('Successfully added!', 'success');
        queryClient.invalidateQueries(API_URL?.GET_FAQ);
      }
    },
  });
  // eslint-disable-next-line no-unused-vars
  const faqUpdateQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_FAQ, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg('Successfully Updated !', 'success');
        queryClient.invalidateQueries(API_URL?.GET_FAQ);
      } else {
        successMsg('Q&A not found');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const faqDeleteQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_FAQ, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Successfully deleted!', 'success');
        queryClient.invalidateQueries(API_URL?.GET_FAQ);
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const reasonSortQuery = useMutation((data) => AXIOS.post(API_URL.SORT_CHAT_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL?.GET_CHAT_REASON);
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const reasonAddQuery = useMutation((data) => AXIOS.post(API_URL.ADD_CHAT_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg('Successfully added!', 'success');
        queryClient.invalidateQueries(API_URL?.GET_CHAT_REASON);
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const reasonUpdateQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_CHAT_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg('Successfully Updated !', 'success');
        queryClient.invalidateQueries(API_URL?.GET_CHAT_REASON);
      } else {
        successMsg('Q&A not found');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const reasonDeleteQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_CHAT_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Successfully deleted!', 'success');
        queryClient.invalidateQueries(API_URL?.GET_CHAT_REASON);
      }
    },
  });

  // three dot handler
  const threeDotHandler = (menu, item) => {
    console.log('item----> ', item);
    if (menu === 'Edit') {
      setIsReadOnly(false);
      setIsEdit(true);
      setOpen(true);
      setCurrentFaq(item);
    }
    if (menu === 'Delete') {
      setIsReadOnly(false);
      setIsConfirmModalOpen(true);
      setDeletedFaqData(item);
    }
    if (menu === 'View') {
      setIsReadOnly(true);
      setIsEdit(true);
      setCurrentFaq(item);
      setOpen(true);
    }
  };

  const callDeleteFaq = () => {
    if (deleteFaqData.type === 'orderSupport' || deleteFaqData.type === 'accountSupport') {
      reasonDeleteQuery.mutate({ id: deleteFaqData?._id });
      return;
    }

    faqDeleteQuery.mutate({ id: deleteFaqData?._id });
  };

  // add faq
  const callAddFaq = (item) => {
    if (!queryValidation(item)) {
      return;
    }

    if (item.type === 'orderSupport' || item.type === 'accountSupport') {
      reasonAddQuery.mutate(item);
      return;
    }

    faqAddQuery.mutate(item);
  };

  // update faq
  const callUpdateFaq = (item) => {
    if (!queryValidation(item)) {
      return;
    }

    if (item.type === 'orderSupport' || item.type === 'accountSupport') {
      reasonUpdateQuery.mutate(createUpdateData(item));
      return;
    }

    faqUpdateQuery.mutate(createUpdateData(item));
  };

  const dropSort = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;
    if (type === 'faq') {
      const item = getChatFaq?.data?.data?.list.splice(removedIndex, 1);
      getChatFaq?.data?.data?.list.splice(addedIndex, 0, item[0]);
      faqSortQuery.mutate({
        faqs: getChatFaq?.data?.data?.list.map((item, index) => ({
          id: item._id,
          sortingOrder: index + 1,
        })),
      });
    } else {
      const item = getChatReason?.data?.data?.chatReason.splice(removedIndex, 1);
      getChatReason?.data?.data?.chatReason.splice(addedIndex, 0, item[0]);
      reasonSortQuery.mutate({
        chatReasons: getChatReason?.data?.data?.chatReason.map((item, index) => ({
          id: item._id,
          sortingOrder: index + 1,
        })),
      });
    }
  };

  return (
    <>
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
              setType(() => (newValue === 0 ? 'orderSupport' : newValue === 1 ? 'accountSupport' : 'faq'));
              // setIsSideBarOpen(false);
            }}
          >
            <Tab label="Order"></Tab>
            <Tab label="Account"></Tab>
            <Tab label="FAQ"></Tab>
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
              onChange: (e) => setStatus(e.target.value),
            }}
          />

          <AddMenuButton
            onClick={() => {
              setOpen(() => {
                setIsEdit(false);
                setIsReadOnly(false);
                return true;
              });
            }}
          />
        </Stack>

        <Box>
          <FaqTable
            supportReason={{ type: currentTab === 0 ? 'orderSupport' : currentTab === 1 ? 'accountSupport' : 'faq' }}
            items={currentTab !== 2 ? getChatReason?.data?.data?.chatReason || [] : getChatFaq?.data?.data?.list || []}
            // items={filterReasons()}
            threeDotHandler={threeDotHandler}
            faqLoading={getChatReason?.isLoading || getChatFaq?.isLoading}
            setDataCounter={setDataCounter}
            dataCounter={dataCounter}
            onDrop={dropSort}
          />
        </Box>
      </Box>
      <Drawer open={open} anchor="right">
        <AddFaq
          isEdit={isEdit}
          isReadOnly={isReadOnly}
          loading={
            currentTab !== 2
              ? reasonUpdateQuery?.isLoading || reasonAddQuery?.isLoading
              : faqUpdateQuery?.isLoading || faqAddQuery?.isLoading
          }
          faq={
            isEdit
              ? currentFaq
              : { type: currentTab === 0 ? 'orderSupport' : currentTab === 1 ? 'accountSupport' : 'faq' }
          }
          submitHandler={isEdit ? callUpdateFaq : callAddFaq}
          onClose={() => setOpen(false)}
        />
      </Drawer>
      {/* modal */}
      <ConfirmModal
        message="Do you want to delete this Q&A ?"
        isOpen={isConfirmModalOpen}
        blurClose
        onCancel={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          callDeleteFaq();
          setIsConfirmModalOpen(false);
        }}
      />
    </>
  );
}

export default Faq;
