export const createDateWithType = (data = []) =>
  data?.map((sObj) => ({
    ...sObj,
    featuredItems: sObj?.featuredItems?.map((item) => ({ ...item, featuredType: sObj?.featuredType })),
  }));

export const createDataForFullUpdate = (data = []) =>
  data?.map((sObj) => ({
    ...sObj,
    _id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    featuredItems: sObj?.featuredItems?.map((item) => ({ ...item, featuredType: undefined, _id: undefined })),
  }));

export const createUpdateData = (sObj, field) => {
  sObj.featuredItems = sObj?.featuredItems?.map((fld) => {
    const item = fld?._id === field?._id ? field : fld;
    return {
      ...item,
      featuredType: undefined,
    };
  });

  return sObj;
};
