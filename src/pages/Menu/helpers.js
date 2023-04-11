// menu options
export const addMenuOptions = [
  {
    label: 'Add item',
    value: 'add-item',
  },
  {
    label: 'Add category',
    value: 'add-category',
  },
];

export const getProductMenuOptions = (product) => [
  {
    label: 'Edit item',
    value: 'edit',
  },
  {
    label: 'Go to marketing',
    value: 'marketing',
  },
  {
    label: 'Mark as sold out',
    value: 'soldOut',
  },
  {
    label: product?.productVisibility ? 'Deactivate' : 'Active',
    value: 'visibility',
  },
  {
    label: 'Add favourite',
    value: 'favourite',
  },
];

// state inits
export const attributeOptions = [
  {
    label: 'Yes',
    value: 'yes',
  },
  {
    label: 'No',
    value: 'no',
  },
];

export const attributeTypeAvailableOptions = [
  {
    label: 'Multi-select',
    value: 'multi-select',
  },
  {
    label: 'Required',
    value: 'required',
  },
];

export const dietryOptions = [
  {
    label: 'Vegetarian',
    value: 'vegetarian',
  },
  {
    label: 'Vegan',
    value: 'vegan',
  },
  {
    label: 'Gluten-free',
    value: 'gluten-free',
  },
  {
    label: 'Low-cal',
    value: 'low-cal',
  },
];

export const productInit = {
  name: '',
  type: '',
  category: '',
  description: '',
  price: '',
  photo: [],
  attributeTitle: '',
  attributes: [],
  attributeTypeOptions: [],
  adddons: [],
  dietry: [],
};

export const attributeInit = {
  name: '',
  price: '',
};

export const createCatagory = (data, type) => {
  if (type === 'bestseller') {
    return {
      category: {
        _id: 'bestsellerItems',
        name: 'Best sellers',
        isUnsortable: true,
        isShopBestSellers: true,
      },
      sortedProducts:
        data?.bestSellerItems?.map((item) => ({
          ...item?._id,
          totalSold: item?.totalSold,
          isUnsortable: true,
        })) || [],
    };
  }

  return {
    category: {
      _id: 'shopfavoriteItems',
      name: 'Favourites',
      isUnsortable: true,
      isShopFavorites: true,
    },
    sortedProducts:
      data?.shopFavouriteItems?.map((item) => ({
        ...item?._id,
        totalSold: item?.totalSold,
      })) || [],
  };
};

export const validateCategory = (category) => {
  const status = {
    status: true,
    msg: null,
  };

  if (!category?.type) {
    status.status = false;
    status.msg = 'Category type cannot be empty';
    return status;
  }

  if (!category?.name?.trim()) {
    status.status = false;
    status.msg = 'Category name cannot be empty';
    return status;
  }

  if (category?.type !== 'food' && !category?.image) {
    status.status = false;
    status.msg = 'Category image cannot be empty';
    return status;
  }

  return status;
};
