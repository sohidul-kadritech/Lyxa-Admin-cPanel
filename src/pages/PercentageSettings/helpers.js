import { successMsg } from '../../helpers/successMsg';

export const discountTypeOptions = [
  {
    value: 'percentage',
    label: 'Percentage',
  },
  {
    value: 'amount',
    label: 'Amount',
  },
];

export const generatedDataForRange = (data, allData, type) => {
  if (type === 'butler') {
    return {
      deliveryRangeButler: [...allData, data],
    };
  }
  if (type === 'delivery') {
    return {
      deliveryRange: [...allData, data],
    };
  }
  return false;
};

export const generatedDataForRangeDelete = (data, allData, type) => {
  if (type === 'butler') {
    return {
      deliveryRangeButler: allData.filter((item) => item.from !== data.from && item.to !== data.to),
    };
  }
  if (type === 'delivery') {
    return {
      deliveryRange: allData.filter((item) => item.from !== data.from && item.to !== data.to),
    };
  }
  return false;
};

export const validateRange = (allValue, newValue) => {
  // const existingRange = allValue.find((range) => range.from === newValue.from && range.to === newValue.to);
  if (!newValue.from) {
    successMsg('Enter From Range', 'error');
    return false;
  }
  if (!newValue.to) {
    successMsg('Enter To Range', 'error');
    return false;
  }
  if (!newValue.charge) {
    successMsg('Enter Charge', 'error');
    return false;
  }

  if (Number(newValue.from) > Number(newValue.to)) {
    successMsg('From Range should be less than To Range', 'error');
    return false;
  }

  if (Number(newValue.charge) < Number(newValue.deliveryPersonCut)) {
    successMsg("Delivery person cut can't be getter than charge", 'error');
    return false;
  }
  const existingRange = allValue?.filter((item) => {
    if (Number(newValue.from) > item.from && Number(newValue.from) < item?.to) {
      console.log('1st item');
      return true;
    }
    if (Number(newValue.to) >= item.from && Number(newValue.to) <= item?.to) {
      console.log('2nd item');
      return true;
    }
    return false;
  });

  console.log('existingRange: ', existingRange);

  if (existingRange.length > 0) {
    successMsg('Range is already exist!');
  } else {
    return true;
  }
  return false;
};
