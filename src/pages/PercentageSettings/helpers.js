import { successMsg } from '../../helpers/successMsg';

export const discountTypeOptions = [
  {
    value: 'percentage',
    label: 'Percentage',
  },
];

export const getIndexFromRange = (range, changedRange) => {
  const index = range.findIndex(
    // eslint-disable-next-line prettier/prettier
    (item) =>
      item.from.toString() === changedRange.from.toString() && item.to.toString() === changedRange.to.toString(),
  );
  return index;
};

export const getInitialDataForAddRange = (editedData) => {
  if (!editedData) {
    return {
      from: 0,
      to: 0,
      charge: 0,
      deliveryPersonCut: 0,
    };
  }

  return { ...editedData, from: editedData?.from ? editedData?.from : '0' };
};

export const generatedDataForRange = (data, allData, type, isEdit) => {
  if (type === 'butler' && !isEdit) {
    return {
      deliveryRangeButler: [...allData, data],
    };
  }
  if (type === 'butler' && isEdit) {
    const index = getIndexFromRange(allData, data);
    allData[index].charge = data?.charge;
    allData[index].deliveryPersonCut = data?.deliveryPersonCut;
    return {
      deliveryRangeButler: [...allData],
    };
  }

  if (type === 'delivery' && !isEdit) {
    return {
      deliveryRange: [...allData, data],
    };
  }
  if (type === 'delivery' && isEdit) {
    const index = getIndexFromRange(allData, data);
    allData[index].charge = data?.charge;
    allData[index].deliveryPersonCut = data?.deliveryPersonCut;
    return {
      deliveryRange: [...allData],
    };
  }
  return false;
};

export const generatedDataForRangeDelete = (data, allData, type) => {
  const value = allData.map((range) => range.to);
  value.sort((a, b) => b - a);
  if (value[0] !== data?.to && type !== 'seller') {
    const range = allData.find((item) => item.to === value[0]);
    successMsg(`Only max delivery range can be delete (try:${range.from}-${range.to}Km)`);
    return false;
  }
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

  if (existingRange.length > 0) {
    successMsg('Range is already exist!');
  } else {
    const value = allValue.map((range) => range.to);
    value.sort((a, b) => b - a);
    if (Number(newValue.from) !== Number(value[0]) && value.length > 0) {
      successMsg(`Range Should Start from ${value[0]} KM`);
      return false;
    }
    if (value.length === 0 && Number(newValue.from) !== 0) {
      successMsg('Range Should Start From 0 KM');
      return false;
    }
    return true;
  }
  return false;
};

export const validateGlobalCharge = (oldValue, newValue) => {
  if (oldValue?.dropPercentage !== newValue?.globalCharge) {
    return true;
  }
  return false;
};

export const validateEditeCharge = (allData, currentData, oldData) => {
  if (
    oldData?.charge.toString() === currentData?.charge.toString() &&
    oldData?.deliveryPersonCut.toString() === currentData?.deliveryPersonCut.toString()
  ) {
    successMsg('Please make a change !');
    return false;
  }

  if (
    oldData?.charge.toString() !== currentData?.charge.toString() &&
    oldData?.deliveryPersonCut.toString() === currentData?.deliveryPersonCut.toString()
  ) {
    if (getIndexFromRange(allData, currentData) < 0) {
      successMsg('Range s Not Found');
    }
    return getIndexFromRange(allData, currentData) > -1;
  }

  if (
    oldData?.charge.toString() === currentData?.charge.toString() &&
    oldData?.deliveryPersonCut.toString() !== currentData?.deliveryPersonCut.toString()
  ) {
    if (getIndexFromRange(allData, currentData) < 0) {
      successMsg('Range s Not Found');
    }
    return getIndexFromRange(allData, currentData) > -1;
  }

  if (
    oldData?.charge.toString() !== currentData?.charge.toString() &&
    oldData?.deliveryPersonCut.toString() !== currentData?.deliveryPersonCut.toString()
  ) {
    if (getIndexFromRange(allData, currentData) < 0) {
      successMsg('Range s Not Found');
    }
    return getIndexFromRange(allData, currentData) > -1;
  }
  return false;
};
