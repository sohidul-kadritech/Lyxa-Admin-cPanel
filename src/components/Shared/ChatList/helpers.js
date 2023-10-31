export const getThreeDotsMenuOptions = (chat) => {
  console.log({ chat });

  const options = [];
  const hideUpdateAndCancel = ['cancelled', 'delivered', 'refused'];

  if (chat?.status === 'accepted') {
    options.push({ label: 'Resolve ticket', value: 'resolve_ticket' });
  }

  if (hideUpdateAndCancel.indexOf(chat?.order?.orderStatus) === -1 && chat?.chatType === 'order') {
    options.push({ label: 'Update status', value: 'update_status' });
    options.push({ label: 'Cancel Order', value: 'cancel_order' });
    options.push({ label: 'Track Order', value: 'track_order' });
    options.push({ label: 'Change Address', value: 'change_address' });
    options.push({ label: 'Adjust Order', value: 'adjust_order' });
  }

  if (
    chat?.order?.orderStatus === 'delivered' &&
    !chat?.order?.isRefundedAfterDelivered &&
    !chat?.order?.replacementOrder &&
    !chat?.order?.isReplacementOrder &&
    !chat?.order?.isButler &&
    chat?.chatType === 'order'
  ) {
    options.push({ label: 'Flag', value: 'flag' });
  }

  return options;
};
