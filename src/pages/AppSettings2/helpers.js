export const separatesUpdatedData = (oldUnits, NewUnits) => {
  const data = NewUnits.filter((unit) => !oldUnits.includes(unit));
  // const deleted = NewUnits.filter((unit) => !oldUnits.includes(unit.name));

  return data;
};
