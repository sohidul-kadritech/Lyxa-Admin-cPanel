/* eslint-disable no-unsafe-optional-chaining */
export const chatStatusColorMap = {
  pending: {
    color: '#417C45',
    background: '#DCFCE7',
    label: 'Pending',
  },

  closed: {
    color: '#8950FC',
    background: '#E1D2FF',
    label: 'Resolved',
  },

  accepted: {
    color: '#FFAB09',
    background: 'rgba(255, 176, 23, 0.2)',
    label: 'Ongoing',
  },

  timeout: {
    color: '#DD5B63',
    background: '#F3BCBF',
    label: 'Timed Out',
  },
};

export const createChatFromOrder = (order) => {
  const recentRequest =
    order?.admin_chat_request?.at(-1) || order?.admin_chat_request?.[order?.admin_chat_request?.length - 1];
  recentRequest.order = order;
  recentRequest.user = order?.user;
  return recentRequest;
};
