/* eslint-disable */
// REQUIRED CSS FOR COMPONENTS
import 'flatpickr/dist/themes/material_green.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
/* eslint-enable */
/* eslint-disable */
/* eslint-disable react/destructuring-assignment */

import React, { useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
import { useDispatch, useSelector } from 'react-redux';
import CircularLoader from './components/CircularLoader';

// Import scss
import './assets/scss/theme.scss';
import getCookiesAsObject from './helpers/cookies/getCookiesAsObject';
import { socketConnect } from './store/socket/socketAction';

import { Box } from '@mui/material';
import { useQuery, useQueryClient } from 'react-query';
import Router from './Router';
import { getUserData, removeAuthCookies } from './appHelpers';
import socketServices from './common/socketService';
import { useGlobalContext } from './context';
import { successMsg } from './helpers/successMsg';
import * as Api from './network/Api';
import AXIOS from './network/axios';

export default function App() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { dispatchCurrentUser, currentUser, dispatchGeneral } = useGlobalContext();
  const { userType } = currentUser;
  const { socket } = useSelector((state) => state.socketReducer);
  const [adminDataIsLoading, setAdminDataIsLoading] = useState(true);

  const settingsQuery = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS), {
    enabled: false,
    onSuccess: (data) => {
      if (data?.status && data?.data?.appSetting) {
        dispatchGeneral({ type: 'appSetting', payload: { appSetting: data?.data?.appSetting } });
      }
    },
  });

  const validateUser = async () => {
    // no cookie found inside user browser
    if (document.cookie.length < 1) {
      setAdminDataIsLoading(false);
      return;
    }

    const { account_type, account_id, access_token, credentialUserId } = getCookiesAsObject();

    // any cookie is missing
    if (!account_type || !account_id || !access_token || !credentialUserId) {
      removeAuthCookies();
      setAdminDataIsLoading(false);
      return;
    }

    // get user data
    const userData = await getUserData(account_type, account_id, credentialUserId);

    // user data is not found
    if (!userData?.status && userData?.invalidUser) {
      removeAuthCookies();
      setAdminDataIsLoading(false);
      return;
    }

    dispatchCurrentUser({ type: account_type, payload: { [account_type]: userData?.user, isCurrentUser: true } });
    dispatchCurrentUser({ type: 'credentialUserId', payload: { credentialUserId: credentialUserId } });
    setAdminDataIsLoading(false);
  };

  useEffect(() => {
    validateUser();
    settingsQuery.refetch();
  }, []);

  useEffect(() => {
    dispatch(socketConnect());
    if (userType) {
      socketServices?.on('user_send_chat_request', (data) => {
        successMsg(`New chat request from ${data?.user?.name}`, 'success');
        queryClient.invalidateQueries(Api.ONGOING_CHATS);
      });
    }

    return () => {
      socketServices?.removeListener(`user_send_chat_request`);
    };
  }, [userType]);

  return (
    <Box>
      {(adminDataIsLoading || settingsQuery?.isLoading) && (
        <Box
          sx={{
            height: '100vh',
          }}
        >
          <CircularLoader />
        </Box>
      )}
      {!adminDataIsLoading && !settingsQuery?.isLoading && <Router />}
    </Box>
  );
}
