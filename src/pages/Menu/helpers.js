import { getImageUrl } from '../../helpers/images';

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

export const getProductMenuOptions = (product, shopFavourites) => [
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
    label: shopFavourites?.find((item) => item?.product?._id === product?._id) ? 'Remove favourite' : 'Add favourite',
    value: 'favourite',
  },
];

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
    value: 'multiple',
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

// state inits
export const productAttrInit = {
  name: '',
  required: false,
  select: '',
  items: [],
};

export const productInit = {
  name: '',
  type: '',
  shop: '',
  category: '',
  seoDescription: '',
  price: '',
  images: [],
  attributes: [{ ...productAttrInit }],
  addons: [],
  dietary: [],
  note: '',
  stockQuantity: 1,
};

export const attrItemInit = {
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
      data?.map((item) => ({
        ...item?.product,
      })) || [],
  };
};

export const createProductData = async (product, shop, isEditProduct) => {
  const imgUrl = await getImageUrl(product?.images[0]);

  if (!imgUrl) {
    return {
      status: false,
      message: 'Error while uploading image',
    };
  }

  // variant props
  let stockQuantity = product?.stockQuantity;
  let addons = product?.addons;
  let attributes = product?.attributes;
  let dietry = product?.dietry;

  if (shop?.shopType === 'food') {
    stockQuantity = undefined;
    addons = product?.addons?.map((p) => p?._id);
    if (attributes[0]) {
      attributes[0].items = attributes[0].items.filter((item) => item.name && item.extraPrice);
    }
  } else {
    dietry = undefined;
    addons = undefined;
    attributes = undefined;
  }

  return {
    ...product,
    name: product.name.trim(),
    seoDescription: product.seoDescription.trim(),
    images: [imgUrl],
    stockQuantity,
    dietry,
    addons,
    attributes,
    id: isEditProduct ? product?._id : undefined,
  };
};

export const getAttrOptionsValues = (product) => {
  const values = [];
  if (product?.attributes[0] && product?.attributes[0]?.required) values.push('required');
  if (product?.attributes[0] && product?.attributes[0]?.select === 'multiple') values.push('multiple');
  return values;
};

export const getProductInit = (shop, categoryId) => {
  const data = { ...productInit };

  data.type = shop?.shopType || '';
  data.shop = shop?._id || '';
  data.category = categoryId || '';

  return data;
};

// validate
export const validateCategory = (category) => {
  const status = {
    status: false,
    msg: null,
  };

  if (!category?.type) {
    status.msg = 'Category type cannot be empty';
    return status;
  }

  if (!category?.name?.trim()) {
    status.msg = 'Category name cannot be empty';
    return status;
  }

  if (category?.type !== 'food' && !category?.image?.length) {
    status.msg = 'Category image cannot be empty';
    return status;
  }

  return {
    status: true,
  };
};

// validate
export const validateProduct = (product) => {
  const status = {
    status: false,
    msg: null,
  };

  if (!product?.type) {
    status.msg = 'Product type cannot be empty';
    return status;
  }

  if (!product?.name?.trim()) {
    status.msg = 'Product name cannot be empty';
    return status;
  }

  if (!product?.category) {
    status.msg = 'Product category cannot be empty';
    return status;
  }

  if (!product?.seoDescription) {
    status.msg = 'Product description cannot be empty';
    return status;
  }

  if (!product?.price) {
    status.msg = 'Product price cannot be empty';
    return status;
  }

  if (!product?.images?.length) {
    status.msg = 'Product image cannot be empty';
    return status;
  }

  if (
    product?.type === 'food' &&
    product?.attributes[0] &&
    (product?.attributes[0]?.required || product?.attributes[0]?.select) &&
    !product?.attributes[0]?.name
  ) {
    status.msg = 'Please add attribte title or keep as default';
    return status;
  }

  if (
    product?.type === 'food' &&
    product?.attributes[0] &&
    (product?.attributes[0]?.required || product?.attributes[0]?.select) &&
    !product?.attributes[0]?.items?.length
  ) {
    status.msg = 'Please add attribtes or keep as default';
    return status;
  }

  return {
    status: true,
  };
};
