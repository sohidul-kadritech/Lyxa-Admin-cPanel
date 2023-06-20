import { Box, Drawer } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
import AddMessage from './AddMessage';
import SearchBar from './SearchBar';
import DefaultChatTable from './Table';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Default Chat',
    to: '#',
  },
];

const getQueryParamsInit = {
  search: '',
};

function DefaultChat2() {
  const [queryParams, setQueryParams] = useState(getQueryParamsInit);
  const [, setTotalPage] = useState(1);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const getDefaultMessage = useQuery(
    [API_URL.GET_DEFAULT_CHAT, queryParams],
    () =>
      AXIOS.get(API_URL.GET_DEFAULT_CHAT, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const addMessageQuery = useMutation((data) => AXIOS.post(API_URL.ADD_DEFAULT_CHAT, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL.GET_DEFAULT_CHAT);
        successMsg(data.messages, 'success');
        setOpen(false);
      } else {
        successMsg(data.messages, 'error');
      }
    },
  });
  const updateMessageQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_DEFAULT_CHAT, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL.GET_DEFAULT_CHAT);
        successMsg(data.messages, 'success');
        setOpen(false);
      } else {
        successMsg(data.messages, 'error');
      }
    },
  });

  console.log('getAdminLog', getDefaultMessage?.data?.data);

  return (
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
      <Box>
        <SearchBar
          setQueryParams={setQueryParams}
          queryParams={queryParams}
          searchPlaceHolder="Search..."
          onAdd={() => setOpen(true)}
        />
      </Box>

      <Box>
        {getDefaultMessage?.isLoading ? (
          <TablePageSkeleton row={5} column={3} />
        ) : (
          <DefaultChatTable
            setOpen={setOpen}
            setIsEdit={setIsEdit}
            setRowData={setRowData}
            setIsReadOnly={setIsReadOnly}
            data={getDefaultMessage?.data?.data?.messages}
            loading={getDefaultMessage?.isLoading}
          />
        )}
      </Box>

      <Drawer open={open} anchor="right">
        <AddMessage
          isEdit={isEdit}
          isReadOnly={isReadOnly}
          rowData={isEdit || isReadOnly ? rowData : {}}
          addQuery={isEdit ? updateMessageQuery : addMessageQuery}
          onClose={() => {
            setOpen(false);
            setIsEdit(false);
            setIsReadOnly(false);
            setRowData({});
          }}
        />
      </Drawer>
    </Box>
  );
}

export default DefaultChat2;
