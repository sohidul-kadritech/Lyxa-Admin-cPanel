export const separatesUpdatedData = (oldUnits, NewUnits) => {
  const data = NewUnits.filter((unit) => !oldUnits.includes(unit));

  return data;
};

export const separatesDeletedData = (oldUnits, NewUnits) => {
  const data = NewUnits.filter((unit) => !oldUnits.includes(unit));

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
  if (newData?.nearByShopKm?.toString() !== oldData?.nearByShopKm?.toString()) {
    newType.push(typeList[0]);
  }
  if (newData?.maxDistanceForButler?.toString() !== oldData?.maxDistanceForButler?.toString()) {
    newType.push(typeList[1]);
  }
  if (!hasDuplicates(newData?.maxDiscount, oldData?.maxDiscount)) {
    newType.push(typeList[2]);
  }
  if (newData?.maxCustomerServiceValue?.toString() !== oldData?.maxCustomerServiceValue?.toString()) {
    newType.push(typeList[3]);
  }
  if (!hasDuplicates(newData?.searchDeliveryBoyKm, oldData?.searchDeliveryBoyKm)) {
    newType.push(typeList[4]);
  }
  if (newData?.currency?.code?.toString() !== oldData?.currency?.code?.toString()) {
    newType.push(typeList[5]);
  }
  if (newData?.vat?.toString() !== oldData?.vat?.toString()) {
    newType.push(typeList[6]);
  }
  if (newData?.maxTotalEstItemsPriceForButler?.toString() !== oldData?.maxTotalEstItemsPriceForButler?.toString()) {
    newType.push(typeList[7]);
  }
  if (newData?.nearByShopKmForUserHomeScreen?.toString() !== oldData?.nearByShopKmForUserHomeScreen?.toString()) {
    newType.push(typeList[8]);
  }
  // if (newData?.secondaryCurrency !== oldData?.secondaryCurrency) {
  //   newType.push(typeList[9]);
  // }
  // if (newData?.exchangeRate !== oldData?.exchangeRate) {
  //   newType.push(typeList[10]);
  // }
  // if (newData?.acceptedCurrency !== oldData?.acceptedCurrency) {
  //   newType.push(typeList[11]);
  // }
  console.log('types:', newType);
  console.log('newData', newData, ' oldData', oldData);

  return { ...newData, vat: newData?.vat ? newData?.vat : 0, type: newType };
};
