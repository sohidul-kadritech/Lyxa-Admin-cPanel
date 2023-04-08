import { successMsg } from '../../../../../helpers/successMsg';

export const validateRewardCategory = (category, rewardCategories) => {
  if (!category?.name?.trim()) {
    successMsg('Reward Category must have a name');
    return false;
  }

  if (rewardCategories.find((item) => item.name === category.name && item?._id !== category?._id)) {
    successMsg('The category name already exists');
    return false;
  }

  if (!category?.status?.trim()) {
    successMsg('Reward Category must have a status');
    return false;
  }

  return true;
};

export const validateRewardBundle = (bundle, rewardBundles) => {
  if (Number(bundle) < 1) {
    successMsg('Reward Bundle cannot be smaller than 1');
    return false;
  }

  if (Number.isNaN(Number(bundle))) {
    successMsg('Please enter a valid value');
    return false;
  }

  if (rewardBundles.includes(Number(bundle))) {
    successMsg('Reward Bundle item already exists');
    return false;
  }

  return true;
};

export const confirmActionInit = {
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
};
