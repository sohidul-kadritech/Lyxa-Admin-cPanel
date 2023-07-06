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
  console.log(' newOne ', sortedArr1, ' oldeone ', sortedArr2);
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
  'currency',
  'vat',
  'maxTotalEstItemsPriceForButler',
  'nearByShopKmForUserHomeScreen',
  'secondaryCurrency',
  'exchangeRate',
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
  if (!hasDuplicates(newData?.maxDiscount, oldData?.maxDiscount)) {
    newType.push(typeList[2]);
  }
  if (parseInt(newData?.maxCustomerServiceValue, 10) !== parseInt(oldData?.maxCustomerServiceValue, 10)) {
    newType.push(typeList[3]);
  }
  if (!hasDuplicates(newData?.searchDeliveryBoyKm, oldData?.searchDeliveryBoyKm)) {
    newType.push(typeList[4]);
  }
  if (newData?.currency?.code?.toString() !== oldData?.currency?.code?.toString()) {
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
    parseInt(newData?.exchangeRate, 10) !== parseInt(oldData?.exchangeRate, 10) ||
    parseFloat(newData?.exchangeRate, 10) !== parseFloat(oldData?.exchangeRate, 10)
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
  const exchangeRate = parseInt(newData?.exchangeRate, 10) > 0 ? parseInt(newData?.exchangeRate, 10) : '1';

  return {
    ...newData,
    vat,
    maxCustomerServiceValue,
    nearByShopKm,
    nearByShopKmForUserHomeScreen,
    type: newType,
    exchangeRate,
  };
};
