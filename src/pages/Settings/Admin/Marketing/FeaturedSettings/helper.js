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
      _id: undefined,
    };
  });

  sObj._id = undefined;

  return sObj;
};

export const featuredSettingsInit = {
  food: {
    _id: '1',
    featuredType: 'food',
    featuredItems: [
      {
        featuredWeeklyDuration: 1,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '1',
      },
      {
        featuredWeeklyDuration: 2,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '2',
      },
      {
        featuredWeeklyDuration: 3,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '3',
      },
      {
        featuredWeeklyDuration: 4,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '4',
      },
    ],
  },
  grocery: {
    _id: '2',
    featuredType: 'grocery',
    featuredItems: [
      {
        featuredWeeklyDuration: 1,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '1',
      },
      {
        featuredWeeklyDuration: 2,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '2',
      },
      {
        featuredWeeklyDuration: 3,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '3',
      },
      {
        featuredWeeklyDuration: 4,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '4',
      },
    ],
  },
  pharmacy: {
    _id: '3',
    featuredType: 'pharmacy',
    featuredItems: [
      {
        featuredWeeklyDuration: 1,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '1',
      },
      {
        featuredWeeklyDuration: 2,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '2',
      },
      {
        featuredWeeklyDuration: 3,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '3',
      },
      {
        featuredWeeklyDuration: 4,
        featuredAmount: 0,
        featuredStatus: 'inactive',
        _id: '4',
      },
    ],
  },
};
