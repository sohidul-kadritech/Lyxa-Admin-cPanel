import { isNumber } from 'lodash';
import { successMsg } from '../../helpers/successMsg';

export const separatesUpdatedData = (oldUnits, NewUnits) => {
  console.log('oldUnits', oldUnits, ' newunits ', NewUnits);
  const data = NewUnits?.filter((unit) => !oldUnits?.includes(unit));

  return data;
};

export const separatesDeletedData = (oldUnits, NewUnits) => {
  const data = NewUnits?.filter((unit) => !oldUnits?.includes(unit));

  return data;
};

function convertArrayToInteger(arr) {
  const result = arr.map((element) => parseInt(element, 10));
  return result;
}

export function hasDuplicates(arr1, arr2) {
  const sortedArr1 = convertArrayToInteger(arr1).sort();
  const sortedArr2 = convertArrayToInteger(arr2).sort();
  // Check if the lengths are equal
  if (sortedArr1.length !== sortedArr2.length) {
    return false;
  }

  // Compare the sorted arrays element by element
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

export const typeList = [
  'nearByShopKm',
  'maxDistanceForButler',
  'maxDiscount',
  'maxCustomerServiceValue',
  'searchDeliveryBoyKm',
  'baseCurrency',
  'vat',
  'maxTotalEstItemsPriceForButler',
  'nearByShopKmForUserHomeScreen',
  'secondaryCurrency',
  'adminExchangeRate',
  'acceptedCurrency',
];

export const appSettingsValidateData = (oldData, newData) => {
  const newType = [];
  if (parseInt(newData?.nearByShopKm, 10) !== parseInt(oldData?.nearByShopKm, 10)) {
    newType.push(typeList[0]);
  }
  if (parseInt(newData?.maxDistanceForButler, 10) !== parseInt(oldData?.maxDistanceForButler, 10)) {
    newType.push(typeList[1]);
  }
  if (newData?.maxDiscount !== oldData?.maxDiscount) {
    newType.push(typeList[2]);
  }
  if (parseInt(newData?.maxCustomerServiceValue, 10) !== parseInt(oldData?.maxCustomerServiceValue, 10)) {
    newType.push(typeList[3]);
  }
  if (!hasDuplicates(newData?.searchDeliveryBoyKm, oldData?.searchDeliveryBoyKm)) {
    newType.push(typeList[4]);
  }
  if (newData?.baseCurrency?.code?.toString() !== oldData?.baseCurrency?.code?.toString()) {
    newType.push(typeList[5]);
  }
  if (parseInt(newData?.vat, 10) !== parseInt(oldData?.vat, 10)) {
    newType.push(typeList[6]);
  }
  if (parseInt(newData?.maxTotalEstItemsPriceForButler, 10) !== parseInt(oldData?.maxTotalEstItemsPriceForButler, 10)) {
    newType.push(typeList[7]);
  }
  if (parseInt(newData?.nearByShopKmForUserHomeScreen, 10) !== parseInt(oldData?.nearByShopKmForUserHomeScreen, 10)) {
    newType.push(typeList[8]);
  }
  if (newData?.secondaryCurrency?.code?.toString() !== oldData?.secondaryCurrency?.code?.toString()) {
    newType.push(typeList[9]);
  }
  if (
    parseInt(newData?.adminExchangeRate, 10) !== parseInt(oldData?.adminExchangeRate, 10) ||
    parseFloat(newData?.adminExchangeRate, 10) !== parseFloat(oldData?.adminExchangeRate, 10)
  ) {
    newType.push(typeList[10]);
  }
  if (newData?.acceptedCurrency?.toString() !== oldData?.acceptedCurrency?.toString()) {
    newType.push(typeList[11]);
  }

  console.log('types:', newType);
  console.log('newData', newData, ' oldData', oldData);

  const maxCustomerServiceValue = parseInt(newData?.maxCustomerServiceValue, 10)
    ? parseInt(newData?.maxCustomerServiceValue, 10)
    : '0';

  const nearByShopKmForUserHomeScreen = parseInt(newData?.nearByShopKmForUserHomeScreen, 10)
    ? parseInt(newData?.nearByShopKmForUserHomeScreen, 10)
    : '0';
  const nearByShopKm = parseInt(newData?.nearByShopKm, 10) > 0 ? parseInt(newData?.nearByShopKm, 10) : '0';
  const vat = parseInt(newData?.vat, 10) > 0 ? parseInt(newData?.vat, 10) : '0';
  const adminExchangeRate = Number(newData?.adminExchangeRate);

  return {
    ...newData,
    vat,
    maxCustomerServiceValue,
    nearByShopKm,
    nearByShopKmForUserHomeScreen,
    type: newType,
    adminExchangeRate,
  };
};

// bundle list validation
export const validateList = (newValue, oldList, type) => {
  if (Number(newValue) < 1 && type === 'number') {
    successMsg('Bundle cannot be smaller than 1');
    return false;
  }

  if (Number.isNaN(Number(newValue)) && type === 'number') {
    successMsg('Please enter a valid value');
    return false;
  }
  if (oldList.includes(Number(newValue)) && type === 'number') {
    console.log('into if');
    successMsg('Bundle item already exists');
    return false;
  }
  console.log('after if');
  if (Number(newValue) < 1 && type === 'number') {
    successMsg('Bundle cannot be smaller than 1');
    return false;
  }

  // for text type

  if (!newValue && type === 'text') {
    successMsg('Bundle cannot be smaller than 1 character');
    return false;
  }

  if (oldList.includes(newValue) && type === 'text') {
    successMsg('Bundle item already exists');
    return false;
  }

  return true;
};

// Handle Incremented by one
export const incrementByOneHandler = (setValue, key, setHasChanged) => {
  setHasChanged(true);
  setValue((prev) => {
    if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '') return { ...prev, [key]: parseInt(prev[key], 10) + 1 };
    if (prev[key] === '') return { ...prev, [key]: 1 };
    return { ...prev };
  });
};

// Handle decremented by one
export const decrementByOneHandler = (setValue, key, setHasChanged) => {
  setHasChanged(true);
  setValue((prev) => {
    if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '') return { ...prev, [key]: parseInt(prev[key], 10) - 1 };
    if (prev[key] === '' || prev[key] <= 0) return { ...prev, [key]: 0 };
    return { ...prev };
  });
};

// Handle Incremented by five
export const incrementByFiveHandler = (setValue, key, setHasChanged) => {
  setHasChanged(true);
  setValue((prev) => {
    if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '') return { ...prev, [key]: parseInt(prev[key], 10) + 5 };
    if (prev[key] === '') return { ...prev, [key]: 5 };
    return { ...prev };
  });
};

// Handle decremented by five
export const decrementByFiveHandler = (setValue, key, setHasChanged) => {
  setHasChanged(true);
  setValue((prev) => {
    if (isNumber(parseInt(prev[key], 10)) && prev[key] !== '' && parseInt(prev[key], 10) - 5 > 0)
      return { ...prev, [key]: parseInt(prev[key], 10) - 5 };
    if (prev[key] === '' || prev[key] <= 0) return { ...prev, [key]: 5 };
    return { ...prev };
  });
};

// secondary currency is enable or disabled
export const getSecondaryCurrencyOptions = [
  {
    label: 'Disable',
    value: 'disable',
  },
  {
    label: 'Enable',
    value: 'enable',
  },
];

// which currecny lyxa accept.
export const getAcceptedCurrencyOptions = (base, secondary) => [
  {
    label: 'Both',
    value: 'both',
  },
  {
    label: `${base?.code} Only`,
    value: base?.code,
  },
  {
    label: `${secondary?.code} Only`,
    value: secondary?.code,
  },
];

export const enabledCurrencyOptions = [
  {
    value: 'base',
    label: 'Base Only',
  },
  {
    value: 'both',
    label: 'Both Currencies',
  },
];
