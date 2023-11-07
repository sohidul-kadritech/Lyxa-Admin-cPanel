/* eslint-disable prettier/prettier */
export const getPromotionStatus = (mQuery, type, activeDeals) => {
  if (type && !activeDeals[type]) {
    return 'deactivated';
  }

  if (mQuery?.data?.isNotEligible) {
    return mQuery?.data?.status;
  }

  if (type === 'percentage') {
    const ongoingMarketing = mQuery.data?.data?.marketings?.find((marketing) => marketing?.isActive);
    const scheduledMarketing = mQuery.data?.data?.marketings?.find(
      (marketing) => !marketing?.isActive && marketing?.status === 'active',
    );

    if (ongoingMarketing) {
      return 'ongoing';
    }

    if (scheduledMarketing) {
      return 'scheduled';
    }

    return 'paused';
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
  if (marketing?.marketingDeletedType === 'before_expired') {
    return 'deleted';
  }
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
