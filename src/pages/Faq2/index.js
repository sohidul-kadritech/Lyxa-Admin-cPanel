import { Add } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
// eslint-disable-next-line import/order, no-unused-vars
import DateRange from '../../components/StyledCharts/DateRange';
import { dateRangeInit, statusTypeOptions } from './helpers';

import ConfirmModal from '../../components/Common/ConfirmModal';
import { successMsg } from '../../helpers/successMsg';
import {
  addChatReason,
  deleteChatReason,
  getAllChatReason,
  updateChatReason,
} from '../../store/ChatReason/chatReasonActions';
import { addFaq, deleteFaq, getAllFaq, updateFaq } from '../../store/faq/faqActions';
import AddFaq from './AddFaq';
import FaqTable from './FaqTable';
// import { dateRangeInit } from './helpers/dateRangeInit';

// faq validation
const queryValidation = (item) => {
  switch (false) {
    case Boolean(item?.type):
      successMsg('Q&A type cannot be empty');
      return false;

    case Boolean(item?.ans?.trim()):
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
    to: '#',
  },
  {
    label: 'Support Reasons',
    to: '#',
  },
];

function AddMenuButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add
    </Button>
  );
}

function Faq() {
  // eslint-disable-next-line no-unused-vars

  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { faq: faqQueries, loading: faqLoading } = useSelector((store) => store.faqReducer);
  // eslint-disable-next-line no-unused-vars
  const { chatReasons: chatReasonQueries, loading: chatReasonLoading } = useSelector(
    // eslint-disable-next-line prettier/prettier
    (store) => store.chatReasonReducer,
  );

  // React Query will implement here
  /*--------------------------------*/
  // const getChatReason = useQuery([API_URL?.GET_CHAT_REASON], () =>
  //   AXIOS.get(API_URL?.GET_CHAT_REASON, {
  //     params: {
  //       status: 'active',
  //       type: 'faq',
  //     },
  //     // eslint-disable-next-line prettier/prettier
  //   }),
  // );
  /*--------------------------------*/
  const [range, setRange] = useState({ ...dateRangeInit });
  // eslint-disable-next-line no-unused-vars
  const [query, setQuery] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [currentFaq, setCurrentFaq] = useState({});

  // eslint-disable-next-line no-unused-vars
  const [deleteFaqData, setDeletedFaqData] = useState({});

  // filters
  // eslint-disable-next-line no-unused-vars
  const [sort, setSort] = useState('');
  const [type, setType] = useState('orderSupport');
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isEdit, setIsEdit] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [childType, setChildType] = useState('');
  // get all faqs
  const callGetAllFaq = () => {
    dispatch(getAllFaq());
  };

  // get all chatReason
  const callGetAllChatReason = () => {
    dispatch(getAllChatReason());
  };

  // update faq
  const callUpdateFaq = (item) => {
    if (!queryValidation(item)) {
      return;
    }

    if (item.type === 'orderSupport' || item.type === 'accountSupport') {
      dispatch(updateChatReason({ ...item, answer: item.ans }));
      return;
    }

    dispatch(updateFaq(item));
  };

  // delete faq
  const callDeleteFaq = () => {
    if (deleteFaqData.type === 'orderSupport' || deleteFaqData.type === 'accountSupport') {
      dispatch(deleteChatReason(deleteFaqData?._id));
      // eslint-disable-next-line no-useless-return
      return;
    }

    dispatch(deleteFaq(deleteFaqData?._id));
  };

  // add faq
  const callAddFaq = (item) => {
    if (!queryValidation(item)) {
      return;
    }

    if (item.type === 'orderSupport' || item.type === 'accountSupport') {
      dispatch(addChatReason({ ...item, answer: item.ans }));
      return;
    }

    dispatch(addFaq(item));
  };

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
      console.log('here manu is view');
      setIsReadOnly(true);
      setIsEdit(true);
      setCurrentFaq(item);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (faqQueries?.length === 0) {
      callGetAllFaq();
    }
    if (chatReasonQueries?.length === 0) {
      callGetAllChatReason();
    }
  }, []);

  useEffect(() => {
    const convertedChatReasons = chatReasonQueries.map((item) => ({ ...item, ans: item.answer }));

    setQuery([...faqQueries, ...convertedChatReasons]);
  }, [faqQueries, chatReasonQueries]);

  const filterReasons = () => {
    let data = query;

    if (type !== '') {
      data = data.filter(
        (item) =>
          // eslint-disable-next-line prettier/prettier
          (type === 'faq' && item.type !== 'accountSupport' && item.type !== 'orderSupport') || item.type === type,
      );
    }

    if (childType !== '') {
      data = data.filter((item) => item.type === childType);
    }

    if (status !== '') {
      data = data.filter((item) => item.status === status);
    }

    return data;
  };

  return (
    <>
      <Box>
        <PageTop
          // title="Zone"
          backButtonLabel="Back to Settings"
          breadcrumbItems={breadcrumbItems}
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
            items={filterReasons()}
            threeDotHandler={threeDotHandler}
            faqLoading={faqLoading}
          />
        </Box>
      </Box>
      <Drawer open={open} anchor="right">
        <AddFaq
          isEdit={isEdit}
          isReadOnly={isReadOnly}
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
