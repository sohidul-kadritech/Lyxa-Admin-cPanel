import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

export const businessAccountTypes = [
  {
    value: 'seller',
    label: 'Seller Account',
  },
  {
    value: 'shop',
    label: 'Shop Account',
  },
];

export const adminAccountTypes = [
  {
    value: 'admin',
    label: 'Super Admin',
  },
  {
    value: 'sales',
    label: 'Sales Manager',
  },
  {
    value: 'accountManager',
    label: 'Account Manager',
  },
  {
    value: 'customerService',
    label: 'Customer Sercive',
  },
];

export const credentialsInit = {
  password: '',
  email: '',
};

export const validateForm = (data, errors, setErrors) => {
  console.log('triggered');

  if (!data?.email?.trim()) {
    setErrors({ password: undefined, email: 'Email is required' });
    return;
  }

  // eslint-disable-next-line no-useless-escape
  if (!data?.email?.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/)) {
    setErrors({ password: undefined, email: 'Invalid email address' });
    return;
  }

  if (!data?.password?.trim()) {
    setErrors({ email: undefined, password: 'Password is required' });
    return;
  }

  if (data?.password?.trim()?.length < 6) {
    setErrors({ email: undefined, password: 'Password is has to be atleast 6 chars' });
    return;
  }

  setErrors({ email: undefined, password: undefined });
};

export const getParentUser = async (credentialUser) => {
  const api = credentialUser?.parentShop ? Api.SINGLE_SHOP : Api.SINGLE_SELLER;
  const id = credentialUser?.parentShop || credentialUser?.parentSeller;
  const key = credentialUser?.parentShop ? 'shop' : 'seller';

  try {
    const response = await AXIOS.get(api, {
      params: {
        id,
      },
    });

    // api response false
    if (!response?.status || !response?.data || !response?.data[key]) {
      return { status: false, message: response?.message, parentUser: null };
    }

    return { status: true, message: response?.message, parentUser: response?.data[key] };
  } catch (error) {
    console.log(error);
    return { status: false, message: error?.message, parentUser: null };
  }
};
