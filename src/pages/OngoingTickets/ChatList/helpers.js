export const getThreeDotsMenuOptions = (chat) => {
  const options = [];
  const hideUpdateAndCancel = ['cancelled', 'delivered', 'refused'];

  if (chat?.status === 'accepted') {
    options.push({ label: 'Resolve ticket', value: 'resolve_ticket' });
  }

  if (hideUpdateAndCancel.indexOf(chat?.order?.orderStatus) === -1) {
    options.push({ label: 'Edit status', value: 'update_status' });
    options.push({ label: 'Cancel Order', value: 'cancel_order' });
  }

  options.push({ label: 'Flag', value: 'flag' });

  return options;
};
