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

import { Box } from '@mui/material';
import { useQuery, useQueryClient } from 'react-query';
import Router from './Router';
import { getUserData, removeAuthCookies } from './appHelpers';
import socketServices from './common/socketService';
import { useGlobalContext } from './context';
import * as Api from './network/Api';
import AXIOS from './network/axios';
import { socketConnect } from './store/socket/socketAction';

export default function App() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { dispatchCurrentUser, currentUser, dispatchGeneral } = useGlobalContext();
  const { userType, adminType, shop } = currentUser;
  const { socket } = useSelector((state) => state.socketReducer);

  console.log('socket test', socket);
  const [adminDataIsLoading, setAdminDataIsLoading] = useState(true);
  const [, setRender] = useState(false);

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

  // retries when user comes logs in
  useEffect(() => {
    if (userType) socketConnect();
  }, [userType]);

  useEffect(() => {
    if (userType === 'shop' || userType === 'admin') {
      socketServices.on(`shopLiveStatusUpdated-${shop?._id}`, (data) => {
        if (shop?._id === data?.shopId) {
          console.log('socketdata', data);
          currentUser.shop.liveStatus = data?.liveStatus;
          setRender((prev) => !prev);
        }
      });
    }

    return () => {
      shop?._id && socketServices?.removeListener(`shopLiveStatusUpdated-${shop?._id}`);
    };
  }, [userType, shop]);

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
