import getCookiesAsObject from './helpers/cookies/getCookiesAsObject';
import setCookiesAsObj from './helpers/cookies/setCookiesAsObject';
import * as Api from './network/Api';
import AXIOS from './network/axios';

export const userTypeToApiMap = {
  shop: Api.SINGLE_SHOP,
  seller: Api.SINGLE_SELLER,
  admin: Api.SINGLE_ADMIN,
};

export const getUserData = async (accountType, accountId, credentialUserId) => {
  const api = userTypeToApiMap[accountType];

  // unknown or manipulated accountType - will be logged out
  if (!api) {
    return { status: false, invalidUser: true, user: null };
  }

  try {
    const userData = await AXIOS.get(api, {
      params: {
        id: accountId,
      },
    });

    // could not get user data - so considered invalid user - will be logged out

    if (!userData?.status || !userData?.data[accountType]) {
      return { status: false, invalidUser: true, user: null };
    }

    // user has been deleted - for certain reasons backend will still send it - will be logged out
    if (typeof userData?.data[accountType]?.deletedAt === 'string') {
      return { status: false, invalidUser: true, user: null };
    }

    // only for shop - shop has been deactivaed - will be logged out
    if (accountType === 'shop' && userData?.data[accountType]?.shopStatus === 'inactive') {
      return { status: false, invalidUser: true, user: null };
    }

    // if user has been deactivated - will be logged out
    if (userData?.data[accountType]?.status === 'inactive') {
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
