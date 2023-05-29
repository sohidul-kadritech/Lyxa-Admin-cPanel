export const separatesUpdatedData = (oldUnits, NewUnits) => {
  const data = NewUnits.filter((unit) => !oldUnits.includes(unit));
  // const deleted = NewUnits.filter((unit) => !oldUnits.includes(unit.name));

  return data;
};

export const separatesDeletedData = (oldUnits, NewUnits) => {
  const data = NewUnits.filter((unit) => !oldUnits.includes(unit));
  // const deleted = NewUnits.filter((unit) => !oldUnits.includes(unit.name));

  return data;
};
