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

export const getHistoryMarketingStatus = (marketing) => {
  if (typeof marketing?.deletedAt === 'string') return 'expired';

  if (marketing?.isActive && marketing?.status === 'active') {
    return 'ongoing';
  }

  if (!marketing?.isActive && marketing?.status === 'active') {
    return 'scheduled';
  }

  if (!marketing?.isActive && marketing?.status === 'inactive') {
    return 'paused';
  }

  return '';
};
