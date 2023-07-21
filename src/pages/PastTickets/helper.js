/* eslint-disable no-unsafe-optional-chaining */
export const statusColorVariants = {
  active: {
    color: '#417C45',
    background: '#DCFCE7',
  },

  suspended: {
    color: '#FFAB09',
    background: 'rgba(255, 176, 23, 0.2)',
  },

  inactive: {
    color: '#FFAB09',
    background: 'rgba(255, 176, 23, 0.2)',
  },
};

export const createChatFromOrder = (order) => {
  const recentRequest =
    order?.admin_chat_request?.at(-1) || order?.admin_chat_request?.[order?.admin_chat_request?.length - 1];

  const chat = { order, chatType: 'order', user: order?.user, reasonMessage: recentRequest?.reasonMessage };
  return chat;
};
