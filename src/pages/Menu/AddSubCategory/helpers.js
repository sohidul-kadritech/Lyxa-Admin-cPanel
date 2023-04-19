import { uniqueId } from 'lodash';

export const getSubCategoryInit = () => ({
  name: '',
  id: uniqueId(),
});

export const addSubCategoriesInit = {
  categoryId: '',
  subCategories: [getSubCategoryInit(), getSubCategoryInit()],
};

export const validateAddSubCategories = (addSubCategories) => {
  let message = null;
  const name_map = {};

  if (!addSubCategories?.categoryId?.trim()) {
    message = 'Please select category first';

    return {
      message,
      status: false,
    };
  }

  addSubCategories?.subCategories?.forEach((category) => {
    const fmtName = category?.name?.replaceAll(' ', '_').toLowerCase();

    if (name_map[fmtName]) {
      message = 'Duplicate names are not allowed';
    } else {
      name_map[fmtName] = true;
    }
  });

  if (message) {
    return {
      message,
      status: false,
    };
  }

  return {
    status: true,
  };
};

export const createCategoriesData = (addSubCategories) => ({
  ...addSubCategories,
  subCategories: addSubCategories?.subCategories?.map((category, index) => ({
    name: category?.name,
    status: 'active',
    slug: `${category?.name}${Math.round(Math.random() * (100 + index))}`,
  })),
});
