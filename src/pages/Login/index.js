import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import MetaTags from 'react-meta-tags';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as LyxaIcon } from '../../assets/icons/lyxa-logo-lg.svg';
import { ReactComponent as LyxaText } from '../../assets/icons/lyxa-text-lg.svg';
import { useGlobalContext } from '../../context/GlobalContext';
import setCookiesAsObj from '../../helpers/cookies/setCookiesAsObject';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AccountSelect from './AccountSelect';
import Form from './Form';
import { adminAccountTypes, businessAccountTypes, getParentUser } from './helper';

export default function Login({ loginFor }) {
  const history = useHistory();
  const { dispatchCurrentUser } = useGlobalContext();
  const [accountType, setAccountType] = useState('');
  const [hilightAccountType, setHilightAccountType] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const onLoginSuccess = async (data) => {
    if (!data?.status) {
      setLoginError(data?.message);
      return;
    }

    let currentUser = data?.data?.admin;

    // if credential user
    if (currentUser?.parentSeller || currentUser?.parentShop) {
      const parentUserData = await getParentUser(currentUser);

      if (!parentUserData?.status) {
        setLoginError(parentUserData?.message);
        return;
      }

      const { _id: credentialUserId, token, account_type } = currentUser;
      currentUser = parentUserData?.parentUser;

      currentUser.credentialUserId = credentialUserId;
      currentUser.token = token;
      currentUser.account_type = account_type;
    }

    // success message
    successMsg(data?.message, 'success');

    // save information inside cookies
    setCookiesAsObj(
      {
        access_token: currentUser.token,
        account_type: currentUser.account_type,
        account_id: currentUser._id,
        credentialUserId: currentUser?.credentialUserId || currentUser._id,
      },
      15
    );

    localStorage.setItem('lastLoginType', JSON.stringify(currentUser.account_type));
    // save user information in global store
    dispatchCurrentUser({
      type: currentUser?.account_type,
      payload: { [currentUser?.account_type]: currentUser, isCurrentUser: true },
    });

    // redirect after login success
    if (currentUser?.account_type === 'admin' && currentUser?.adminType) history.push('/orders/list');
    else history.push('/');
  };

  const loginMutation = useMutation((data) => AXIOS.post(Api.LOGIN, data), {
    onSuccess: onLoginSuccess,
    onError: (error) => {
      setLoginError(error?.message);
    },
  });

  const onSubmit = (credentials) => {
    if (!accountType) {
      setHilightAccountType(true);
      setLoginError('Please select account type');
      return;
    }

    loginMutation.mutate({
      ...credentials,
      type: accountType,
    });
  };

  return (
    <>
      <MetaTags>
        <title>Login | Lyxa</title>
      </MetaTags>
      <Box
        sx={{
          backgroundColor: '#363636',
          height: '100vh',
        }}
      >
        <Stack pt={6} pl={9}>
          <AccountSelect
            options={loginFor === 'team' ? adminAccountTypes : businessAccountTypes}
            value={accountType}
            onChange={(event) => {
              setAccountType(event.target.value);
              setHilightAccountType(false);
              setLoginError(null);
            }}
            placeholder={loginFor === 'business' ? 'For Business' : 'For Team'}
            hilightAccountType={hilightAccountType}
          />
        </Stack>
        <Stack alignItems="center" height="calc(100vh - 47px)" justifyContent="center">
          {/* logo */}
          <Stack alignItems="center" justifyContent="center" gap={2} pb={17}>
            <LyxaIcon />
            <LyxaText />
          </Stack>
          <Form onSubmit={onSubmit} loginError={loginError} loading={loginMutation.isLoading} />
        </Stack>
      </Box>
    </>
  );
}
