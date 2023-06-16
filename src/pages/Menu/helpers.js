import { Box, Button, Tooltip, useTheme } from '@mui/material';
import { uniqueId } from 'lodash';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
import { getImageUrl } from '../../helpers/images';

// components
export function ProductOverlayTag({ label, color }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.5)',
        position: 'absolute',
        top: '0',
        left: '0',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontWeight: '500',
          fontSize: '8px',
          lineHeight: '20px',
          color,
          background: '#fff',
          borderRadius: '8px',
          width: '62px',
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {label}
      </span>
    </Box>
  );
}

// menu options
export const getAddMenuOptions = (shopType) => {
  const options = [
    {
      label: 'Add item',
      value: 'add-item',
    },
    {
      label: 'Add category',
      value: 'add-category',
    },
  ];

  if (shopType !== 'food') {
    options.push({
      label: 'Add sub category ',
      value: 'add-sub-category',
    });
  }

  return options;
};

export const getProductMenuOptions = (product, shopFavourites, shopType) => {
  const items = [
    {
      label: 'Edit item',
      value: 'edit',
    },
    {
      label: 'Go to marketing',
      value: 'marketing',
    },
    {
      label: product?.stockQuantity < 1 ? 'Set stock available' : 'Mark as sold out',
      value: 'stock',
    },
    {
      label: product?.status === 'active' ? 'Deactivate' : 'Active',
      value: 'status',
    },
    {
      label: shopFavourites?.sortedProducts?.find((item) => item?._id === product?._id)
        ? 'Remove favourite'
        : 'Add favourite',
      value: 'favourite',
    },
  ];

  return items.filter((itm) => shopType === 'food' || itm.value !== 'favourite');
};

export const bulkItemOptions = [
  {
    label: 'Upload',
    value: 'upload',
  },
  {
    label: 'Download',
    value: 'download',
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

export const attrItemInit = () => ({
  name: '',
  extraPrice: '',
});

// state inits
export const productAttrInit = () => ({
  name: '',
  required: false,
  select: 'single',
  items: [attrItemInit()],
  xid: uniqueId('attr_'),
});

export const productInit = () => ({
  name: '',
  type: '',
  shop: '',
  category: '',
  subCategory: '',
  seoDescription: '',
  price: '',
  images: [],
  attributes: [],
  addons: [],
  dietary: [],
  note: '',
  isStockEnabled: false,
  stockQuantity: 1,
  unit: '',
  isUnitEnabled: false,
});

export const createProductData = async (product, shop, isEditProduct, hasAttribute) => {
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
  let subCategory = product?.subCategory;

  if (shop?.shopType === 'food') {
    stockQuantity = undefined;
    subCategory = undefined;
    addons = product?.addons?.map((p) => p?._id);

    if (attributes?.length && hasAttribute) {
      const attrs = [];

      attributes?.forEach((attr) => {
        // filter attr items
        const items = attr?.items?.filter((item) => item.name && item.extraPrice);

        if (items?.length) {
          attrs.push({
            ...attr,
            items,
            xid: undefined,
          });
        }
      });

      attributes = attrs;
    } else {
      attributes = [];
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
    subCategory,
    id: isEditProduct ? product?._id : undefined,
    unit: product?.isUnitEnabled ? product?.unit : '',
    isUnitEnabled: undefined,
  };
};

// export const getAttrOptionsValues = (product) => {
//   const values = [];
//   if (product?.attributes[0] && product?.attributes[0]?.required) values.push('required');
//   if (product?.attributes[0] && product?.attributes[0]?.select === 'multiple') values.push('multiple');
//   return values;
// };

export const getAttrOptionsValues = (attributeItem) => {
  const values = [];
  if (attributeItem?.required) values.push('required');
  if (attributeItem?.select === 'multiple') values.push('multiple');
  console.log(values);
  return values;
};

export const getProductInit = (shop, categoryId) => {
  const data = productInit();

  data.type = shop?.shopType || '';
  data.shop = shop?._id || '';
  data.category = categoryId || '';

  return data;
};

export const converEditProduct = (product) => {
  const data = {
    isUnitEnabled: Boolean(product?.unit),
    category: product?.category._id,
    subCategory: product?.subCategory?._id,
    images: product?.images?.map((url) => ({
      preview: url,
    })),
  };

  return {
    ...product,
    ...data,
  };
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

export const validateProduct = (product, hasAttribute) => {
  const status = {
    status: false,
    msg: null,
  };

  // console.log(product);

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

  if (product?.type !== 'food' && !product?.subCategory) {
    status.msg = 'Product Sub-Category can not be emtpy';
    return status;
  }

  // if (!product?.seoDescription) {
  //   status.msg = 'Product description cannot be empty';
  //   return status;
  // }

  if (!product?.price) {
    status.msg = 'Product price cannot be empty';
    return status;
  }

  if (!product?.images?.length) {
    status.msg = 'Product image cannot be empty';
    return status;
  }

  if (product?.type === 'food' && hasAttribute === 'yes' && !product?.attributes?.length) {
    status.msg = 'Please add at least one attribute';
    return status;
  }

  if (product?.type === 'food') {
    let error = false;

    product?.attributes?.forEach((attr) => {
      // if (attr?.items?.length && (!attr?.name?.trim() || attr?.name?.trim() === 'Untitled Attribute')) error = true;
      if (!attr?.name?.trim() || attr?.name?.trim() === 'Untitled Attribute') error = 'Please add attribte title';
      if (!attr?.items?.length) error = 'Please add attribute items or remove attribute';
    });

    if (error) {
      status.msg = error;
      return status;
    }
  }

  if (product?.type === 'food') {
    let error = false;

    product?.attributes?.forEach((attr) => {
      // if (attr?.items?.length && (!attr?.name?.trim() || attr?.name?.trim() === 'Untitled Attribute')) error = true;
      if (attr?.items?.length) {
        attr?.items?.forEach((itm) => {
          if (!itm?.extraPrice || itm?.extraPrice < 1 || !itm?.name?.trim()) {
            error = true;
          }
        });
      }
    });

    if (error) {
      status.msg = 'Please fill the attribute details';
      return status;
    }
  }

  if (product?.isUnitEnabled && !product?.unit) {
    status.msg = 'Please select unit or disable unit';
    return status;
  }

  // if (
  //   product?.type === 'food' &&
  //   product?.attributes[0] &&
  //   (product?.attributes[0]?.required || product?.attributes[0]?.select) &&
  //   !product?.attributes[0]?.items?.length
  // ) {
  //   status.msg = 'Please add attribtes or keep as default';
  //   return status;
  // }

  return {
    status: true,
  };
};

export const validateSubCategory = (subCategory) => {
  const status = {
    status: false,
    msg: null,
  };

  if (!subCategory?.category) {
    status.msg = 'Sub-Category must a parent category';
    return status;
  }

  if (!subCategory?.name?.trim()) {
    status.msg = 'Sub-Category name cannot be empty';
    return status;
  }

  return {
    status: true,
  };
};

export function OngoingTag({ label }) {
  return (
    <Button
      variant="contained"
      color="secondary"
      sx={{
        border: '1.25px solid #5E97A9',
        fontSize: '13px',
        lineHeight: '20px',
        background: '#F6F8FA',
        color: '#5E97A9',
        gap: '0px',
        padding: '3px 12px',
        textTransform: 'capitalize',

        '&:hover': {
          background: '#F6F8FA',
          color: '#5E97A9',
        },
      }}
    >
      {label}
    </Button>
  );
}

export const isBestSellerOrFavorite = (bestSellers, favorites, product) => {
  const status = {
    isBestSeller: false,
    isFavorite: false,
  };

  bestSellers.sortedProducts?.forEach((item) => {
    if (item?._id === product?._id) {
      status.isBestSeller = true;
    }
  });

  favorites.sortedProducts?.forEach((item) => {
    if (item?._id === product?._id) {
      status.isFavorite = true;
    }
  });

  return status;
};

export function AttributesTitle({ isEditProduct, isAnotherProductAddon, products = [] }) {
  const theme = useTheme();

  return (
    <span
      style={{
        color: isEditProduct && isAnotherProductAddon ? theme.palette.error.main : undefined,
      }}
    >
      {isEditProduct && isAnotherProductAddon && (
        <Tooltip
          title={
            <>
              <span>This product is addon for other products. Attributes cannot be added untill it's removed from</span>
              <ol
                style={{
                  paddingLeft: '20px',
                  paddingTop: '6px',
                }}
              >
                {products?.map((p) => (
                  <li>{p.name}</li>
                ))}
              </ol>
            </>
          }
        >
          <InfoIcon />
        </Tooltip>
      )}{' '}
      Attributes
    </span>
  );
}
