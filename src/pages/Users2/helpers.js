export const addUserInit = (type, id) => {
  let sellerId;
  let shopId;

  if (type === 'seller') sellerId = id;
  if (type === 'shop') shopId = id;

  return { name: '', email: '', password: '', repeated_password: '', sellerId, shopId };
};

export const validateUser = (data) => {
  const { name, email, password, repeated_password } = data;
  const status = { status: false, message: null };

  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  console.log(data);

  if (!name) {
    status.message = 'Please provide your name!';
    return status;
  }

  if (!password) {
    status.message = 'Please provide your password!';
    return status;
  }

  if (!repeated_password) {
    status.message = 'Please add repeated password!';
    return status;
  }

  if (!email) {
    status.message = 'Please provide your email address!';
    return status;
  }

  if (!emailRegex.test(email)) {
    status.message = 'Email is not valid!';
    return status;
  }

  if (password !== repeated_password) {
    status.message = 'Passwords do not match!';
    return status;
  }

  return { status: true };
};
