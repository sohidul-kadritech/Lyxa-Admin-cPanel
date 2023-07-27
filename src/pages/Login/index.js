import { Box, Modal, Stack } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as LyxaIcon } from '../../assets/icons/lyxa-logo-lg.svg';
import { ReactComponent as LyxaText } from '../../assets/icons/lyxa-text-lg.svg';
import { useGlobalContext } from '../../context';
import setCookiesAsObj from '../../helpers/cookies/setCookiesAsObject';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AccountSelect from './AccountSelect';
import ForgotPassword from './ForgotPassword';
import Form from './Form';
import { adminAccountTypes, businessAccountTypes, getParentUser } from './helper';

export default function Login({ loginFor }) {
  const history = useHistory();
  const { dispatchCurrentUser } = useGlobalContext();
  const [accountType, setAccountType] = useState('');
  const [hilightAccountType, setHilightAccountType] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [modal, setModal] = useState(false);

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

    dispatchCurrentUser({
      type: 'credentialUserId',
      payload: { credentialUserId: currentUser?.credentialUserId || currentUser._id },
    });

    // redirect after login success
    if (currentUser?.account_type === 'admin' && currentUser?.adminType === 'customerService')
      history.push('/ongoing-tickets');
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

    setLoginError(null);

    loginMutation.mutate({
      ...credentials,
      type: accountType,
    });
  };

  const onForgetPassword = () => {
    if (!accountType) {
      setHilightAccountType(true);
      setLoginError('Please select account type');
      return;
    }

    setModal(true);
  };

  return (
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
      {/* logo */}
      <Stack alignItems="center" height="calc(100vh - 47px)" justifyContent="center">
        <Stack alignItems="center" justifyContent="center" gap={2} pb={17}>
          <LyxaIcon />
          <LyxaText />
        </Stack>
        <Form
          onSubmit={onSubmit}
          loginError={loginError}
          loading={loginMutation.isLoading}
          loginFor={loginFor}
          onForgetPassword={onForgetPassword}
        />
      </Stack>
      <Modal open={modal} onClose={() => setModal(false)}>
        <Box>
          <ForgotPassword onClose={() => setModal(false)} loginFor={loginFor} accountType={accountType} />
        </Box>
      </Modal>
    </Box>
  );
}
