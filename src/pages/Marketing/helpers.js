export const getPromotionStatus = (mQuery, type, activeDeals) => {
  if (type && !activeDeals[type]) {
    return 'deactivated';
  }

  if (mQuery?.data?.isNotEligible) {
    return mQuery?.data?.status;
  }

  if (mQuery.data?.data?.marketing?.isActive && mQuery.data?.data?.marketing?.status === 'active') {
    return 'ongoing';
  }

  if (!mQuery.data?.data?.marketing?.isActive && mQuery.data?.data?.marketing?.status === 'active') {
    return 'scheduled';
  }

  if (!mQuery.data?.data?.marketing?.isActive && mQuery.data?.data?.marketing?.status === 'inactive') {
    return 'paused';
  }

  return '';
};
