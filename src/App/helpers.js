import getCookiesAsObject from '../helpers/cookies/getCookiesAsObject';
import setCookiesAsObj from '../helpers/cookies/setCookiesAsObject';
import * as Api from '../network/Api';
import AXIOS from '../network/axios';

export const userTypeToApiMap = {
  shop: Api.SINGLE_USER,
  seller: Api.SINGLE_SELLER,
  admin: Api.SINGLE_ADMIN,
};

export const getUserData = async (accountType, accountId, credentialUserId) => {
  const api = userTypeToApiMap[accountType];

  // unknown or manipulated accountType
  if (!api) {
    return { status: false, invalidUser: true, user: null };
  }

  try {
    const userData = await AXIOS.get(api, {
      params: {
        id: accountId,
      },
    });

    // valid user but could not get user data
    if (!userData?.status || !userData?.data[accountType]) {
      return { status: false, invalidUser: true, user: null };
    }

    // valid user
    return { status: true, user: { ...userData?.data[accountType], credentialUserId } };

    // if api error
  } catch (error) {
    console.log(error);
    return { status: false, invalidUser: false, user: null };
  }
};

export const removeAuthCookies = () => {
  const cookies = getCookiesAsObject();
  setCookiesAsObj(cookies, 0);
  window.location.reload(true);
};
