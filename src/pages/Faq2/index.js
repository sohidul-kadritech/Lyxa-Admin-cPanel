import { Add } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
// eslint-disable-next-line import/order, no-unused-vars
import DateRange from '../../components/StyledCharts/DateRange';
import { dateRangeInit, sortOptions, statusTypeOptions, supportTypeOptions } from './helpers';

import { getAllChatReason } from '../../store/ChatReason/chatReasonActions';
import { getAllFaq } from '../../store/faq/faqActions';
import FaqTable from './FaqTable';
// import { dateRangeInit } from './helpers/dateRangeInit';

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
  const [range, setRange] = useState({ ...dateRangeInit });

  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { faq: faqQueries, loading: faqLoading } = useSelector((store) => store.faqReducer);
  // eslint-disable-next-line no-unused-vars
  const { chatReasons: chatReasonQueries, loading: chatReasonLoading } = useSelector(
    // eslint-disable-next-line prettier/prettier
    (store) => store.chatReasonReducer,
  );

  // eslint-disable-next-line no-unused-vars
  const [query, setQuery] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [currentFaq, setCurrentFaq] = useState({});

  // eslint-disable-next-line no-unused-vars
  const [deleteFaq, setDeleteFaq] = useState({});

  // filters
  // eslint-disable-next-line no-unused-vars
  const [sort, setSort] = useState('');
  const [type, setType] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isFilterApplied, setIsFilterApplied] = useState(false);
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
  // eslint-disable-next-line prettier/prettier

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

  // eslint-disable-next-line no-unused-vars
  const filterReasons = () => {
    // eslint-disable-next-line no-undef
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

      <Stack direction="row" justifyContent="start" gap="17px">
        <StyledSearchBar
          sx={{ flex: '1' }}
          placeholder="Search"
          // onChange={(e) => setSearchedValue(e.target.value)}
        />
        <DateRange range={range} setRange={setRange} />

        {/* sorting order  */}
        <StyledFormField
          // label="Status *"
          intputType="select"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            placeholder: 'Sort',
            name: 'sort',
            value: sort,
            items: sortOptions,
            size: 'sm2',
            //   items: categories,
            onChange: (e) => setSort(e.target.value),
            //   readOnly: Boolean(newProductCategory) || productReadonly,
          }}
        />
        <StyledFormField
          // label="Status *"
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
            //   readOnly: Boolean(newProductCategory) || productReadonly,
          }}
        />
        <StyledFormField
          // label="Status *"
          intputType="select"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            name: 'type',
            placeholder: 'Type',
            value: type,
            items: supportTypeOptions,
            size: 'sm2',
            //   items: categories,
            onChange: (e) => setType(e.target.value),
            //   readOnly: Boolean(newProductCategory) || productReadonly,
          }}
        />

        <AddMenuButton
        //   onClick={() => {
        //     setOpen(() => {
        //       setActionType('add');
        //       return true;
        //     });
        //   }}
        />
      </Stack>

      <Box>
        <FaqTable items={filterReasons()} />
      </Box>
    </Box>
  );
}

export default Faq;
