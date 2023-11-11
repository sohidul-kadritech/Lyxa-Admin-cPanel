/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Box, Button, Drawer, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
// eslint-disable-next-line import/order, no-unused-vars
import { createUpdateData, tabIndexForFAQ } from './helpers';

import SearchBar from '../../components/Common/CommonSearchbar';
import ConfirmModal from '../../components/Common/ConfirmModal';
import TabPanel from '../../components/Common/TabPanel';
import { successMsg } from '../../helpers/successMsg';
import useQueryParams from '../../helpers/useQueryParams';
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

const getQueryParamsInit = {
  status: 'active',
  searchKey: '',
  type: 'orderSupport',
};

export function AddMenuButton({ title = 'Add', isIcon = true, icon = <Add />, ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={isIcon ? icon : ''} {...props}>
      {title}
    </Button>
  );
}

function Faq() {
  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useQueryParams(getQueryParamsInit);

  // const [range, setRange] = useState({ ...dateRangeInit });

  // const [tab, settab] = useState(0);

  const [currentFaq, setCurrentFaq] = useState({});

  const [deleteFaqData, setDeletedFaqData] = useState({});

  // const [searchKey, setSearchKey] = useState('');

  const [dataCounter, setDataCounter] = useState({
    orderSupport: 0,
    accountSupport: 0,
    faq: 0,
  });
  // const [type, setType] = useState('orderSupport');

  // const [status, setStatus] = useState('active');

  const [isEdit, setIsEdit] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [open, setOpen] = useState(false);

  // get request
  const getChatReason = useQuery(
    [API_URL?.GET_CHAT_REASON, queryParams],
    () =>
      AXIOS.get(API_URL?.GET_CHAT_REASON, {
        params: queryParams,
      }),
    {
      enabled: queryParams?.type !== 'faq',
    },
  );

  const getChatFaq = useQuery(
    [API_URL?.GET_FAQ, queryParams],
    () =>
      AXIOS.get(API_URL?.GET_FAQ, {
        params: queryParams,
      }),
    {
      enabled: queryParams?.type === 'faq',
    },
  );

  // // post request
  const faqSortQuery = useMutation((data) => AXIOS.post(API_URL.SORT_FAQ, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL?.GET_FAQ);
      }
    },
  });

  const faqAddQuery = useMutation((data) => AXIOS.post(API_URL.ADD_FAQ, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg('Successfully added!', 'success');
        queryClient.invalidateQueries(API_URL?.GET_FAQ);
      }
    },
  });

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

  const faqDeleteQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_FAQ, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Successfully deleted!', 'success');
        queryClient.invalidateQueries(API_URL?.GET_FAQ);
      }
    },
  });

  const reasonSortQuery = useMutation((data) => AXIOS.post(API_URL.SORT_CHAT_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL?.GET_CHAT_REASON);
      }
    },
  });

  const reasonAddQuery = useMutation((data) => AXIOS.post(API_URL.ADD_CHAT_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg('Successfully added!', 'success');
        queryClient.invalidateQueries(API_URL?.GET_CHAT_REASON);
      }
    },
  });

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

  const reasonDeleteQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_CHAT_REASON, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Successfully Deleted!', 'success');
        queryClient.invalidateQueries(API_URL?.GET_CHAT_REASON);
      }
    },
  });

  // three dot handler
  const threeDotHandler = (menu, item) => {
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
    if (queryParams?.type === 'faq') {
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
            value={tabIndexForFAQ[queryParams?.type]}
            onChange={(event, newValue) => {
              setQueryParams((prev) => ({
                ...prev,
                type: tabIndexForFAQ[newValue],
              }));
            }}
          >
            <Tab label="Order"></Tab>
            <Tab label="Account"></Tab>
            <Tab label="FAQ"></Tab>
          </Tabs>
        </Box>

        <Box marginBottom="30px">
          <SearchBar
            buttonLabel="Add"
            onButtonClick={() => {
              setOpen(() => {
                setIsEdit(false);
                setIsReadOnly(false);
                return true;
              });
            }}
            showFilters={{
              search: true,
              date: false,
              status: true,
              button: true,
            }}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        </Box>

        {/* Orders */}
        <TabPanel index={0} noPadding value={tabIndexForFAQ[queryParams?.type]}>
          <FaqTable
            supportReason={{
              type: queryParams?.type,
            }}
            items={getChatReason?.data?.data?.chatReason || []}
            threeDotHandler={threeDotHandler}
            faqLoading={getChatReason?.isLoading || getChatFaq?.isLoading}
            setDataCounter={setDataCounter}
            dataCounter={dataCounter}
            onDrop={dropSort}
          />
        </TabPanel>

        {/* Account */}
        <TabPanel index={1} noPadding value={tabIndexForFAQ[queryParams?.type]}>
          <FaqTable
            supportReason={{
              type: queryParams?.type,
            }}
            items={getChatReason?.data?.data?.chatReason || []}
            threeDotHandler={threeDotHandler}
            faqLoading={getChatReason?.isLoading || getChatFaq?.isLoading}
            setDataCounter={setDataCounter}
            dataCounter={dataCounter}
            onDrop={dropSort}
          />
        </TabPanel>

        {/* faq */}
        <TabPanel index={2} noPadding value={tabIndexForFAQ[queryParams?.type]}>
          <FaqTable
            supportReason={{
              type: queryParams?.type,
            }}
            items={getChatFaq?.data?.data?.list || []}
            threeDotHandler={threeDotHandler}
            faqLoading={getChatReason?.isLoading || getChatFaq?.isLoading}
            setDataCounter={setDataCounter}
            dataCounter={dataCounter}
            onDrop={dropSort}
          />
        </TabPanel>
      </Box>
      <Drawer open={open} anchor="right">
        <AddFaq
          isEdit={isEdit}
          isReadOnly={isReadOnly}
          loading={
            queryParams?.type !== 'faq'
              ? reasonUpdateQuery?.isLoading || reasonAddQuery?.isLoading
              : faqUpdateQuery?.isLoading || faqAddQuery?.isLoading
          }
          faq={
            isEdit
              ? currentFaq
              : {
                  type: queryParams?.type,
                }
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
