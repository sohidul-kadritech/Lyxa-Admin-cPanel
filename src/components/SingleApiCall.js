import requestApi from '../network/httpRequest';

// eslint-disable-next-line consistent-return
export const callApi = async (sId, api, type) => {
  try {
    const { data } = await requestApi().request(api, {
      params: {
        id: sId,
      },
    });

    if (data.status) {
      return data.data[type];
    }
  } catch (e) {
    console.log(e.message);
  }
};
