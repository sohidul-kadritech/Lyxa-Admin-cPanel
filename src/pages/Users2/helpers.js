export const addUserInit = (type, id) => {
  let sellerId;
  let shopId;

  if (type === 'seller') sellerId = id;
  if (type === 'shop') shopId = id;

  return { name: '', email: '', password: '', repeated_password: '', credentialType: '', sellerId, shopId };
};

export const validateUser = (data, userType) => {
  const { name, email, password, repeated_password, credentialType, isParentUser } = data;

  const status = { status: false, message: null };

  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  if (!name?.trim()) {
    status.message = 'Please provide user name!';
    return status;
  }

  if (password?.trim()?.length && !repeated_password?.trim()) {
    status.message = 'Please add repeated password!';
    return status;
  }

  if (repeated_password?.trim() !== password?.trim()) {
    status.message = 'Passwords do not match!';
    return status;
  }

  if (!email) {
    status.message = 'Please provide user email address!';
    return status;
  }

  if (!emailRegex.test(email)) {
    status.message = 'Email is not valid!';
    return status;
  }

  if (!credentialType && userType === 'shop' && !isParentUser) {
    status.message = 'Select user type';
    return status;
  }

  if (!data?.id && !password?.trim()?.length) {
    status.message = 'Password field should not be empty!';
    return status;
  }

  return { status: true };
};

export const credentialTypeOptions = [
  { label: 'Credential User', value: 'credentialUser' },
  { label: 'Shop Order Manager', value: 'shopOrderManager' },
];
