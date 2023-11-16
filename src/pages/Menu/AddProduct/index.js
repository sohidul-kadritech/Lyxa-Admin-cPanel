/* eslint-disable prettier/prettier */
// third party
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// project import
import { Add } from '@mui/icons-material';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import { shopTypeOptions2 } from '../../../assets/staticData';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledChip from '../../../components/Styled/StyledChips';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { calculateSecondaryCurrency } from '../../RiderProfile/Transactions/helpers';
import {
  AttributesTitle,
  attributeOptions,
  converEditProduct,
  createProductData,
  getDietaryOptions,
  getProductInit,
  productAttrInit,
  validateProduct,
} from '../helpers';
import AttributeItem from './AttributeItem';
import PageSkeleton from './PageSkeleton';

const fieldContainerSx = {
  padding: '14px 0',
};

const tabSx = {
  padding: '8px 12px',
  textTransform: 'none',
};

const getCategoryQueryParams = (shopType, shopId) => ({
  page: 1,
  pageSize: 100,
  searchKey: '',
  sortBy: 'desc',
  type: shopType,
  shopId,
  userType: 'shop',
});

export default function AddProduct({ onClose, editProduct, productReadonly, newProductCategory }) {
  const queryClient = useQueryClient();

  const { currentUser, general } = useGlobalContext();

  const { shop } = currentUser;

  const secondaryCurrency = general?.appSetting?.secondaryCurrency;

  const baseCurrency = general?.appSetting?.baseCurrency;

  const [currentTab, setCurrentTab] = useState(0);

  const [render, setRender] = useState(false);

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const [hasAttribute, setHasAttribute] = useState('no');

  const [product, setProduct] = useState(
    editProduct?._id ? converEditProduct(editProduct) : getProductInit(shop, newProductCategory),
  );

  // addons
  const productsQuery = useQuery(
    [
      'ALL_PRODUCT',
      {
        page: 1,
        pageSize: 100,
        sortBy: 'desc',
        searchKey: '',
        type: 'all',
        productVisibility: true,
        shop: shop?._id,
        status: 'active',
      },
    ],
    () =>
      AXIOS.get(Api.ALL_PRODUCT, {
        params: {
          page: 1,
          pageSize: 100,
          sortBy: 'desc',
          searchKey: '',
          type: 'all',
          productVisibility: true,
          shop: shop?._id,
          status: 'active',
        },
      }),
  );

  const addons = useMemo(
    () =>
      productsQuery?.data?.data?.products?.filter(
        (p) => !p?.attributes?.length && p?.marketing[0]?.type !== 'double_menu',
      ),
    [productsQuery?.data?.data?.products],
  );

  // units
  const unitsQuery = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS));

  // categories
  const setConvertCategories = (data) => {
    const items = [];
    data?.data?.categories?.forEach((c) => {
      items?.push({
        value: c?.category?._id,
        label: c?.category?.name,
        disabled: c?.status === 'inactive',
      });
    });
    setCategories(items);
  };

  const categoriesQuery = useQuery(
    [Api.GET_ALL_CATEGORY, getCategoryQueryParams(shop?.shopType, shop?._id)],
    () =>
      AXIOS.get(Api.GET_ALL_CATEGORY, {
        params: getCategoryQueryParams(shop?.shopType, shop?._id),
      }),
    {
      onSuccess: (data) => {
        setConvertCategories(data);
      },
    },
  );

  const isCategoryIsDisabled = useMemo(() => {
    let disabled = false;
    categoriesQuery?.data?.data?.categories?.forEach((c) => {
      if (product?.category === c?.category?._id && c?.status === 'inactive') disabled = true;
    });
    return disabled;
  }, [categoriesQuery?.data, product?.category]);

  const subCategoriesQuery = useQuery(
    [
      Api.GET_ALL_SUB_CATEGORY,
      {
        categoryId: product?.category,
      },
    ],
    () =>
      AXIOS.get(Api.GET_ALL_SUB_CATEGORY, {
        params: {
          categoryId: product?.category,
        },
      }),
  );

  const isSubCategoryIsDisabled = useMemo(() => {
    let disabled = false;
    subCategoriesQuery?.data?.data?.subCategories?.forEach((sc) => {
      if (product?.subCategory === sc?._id && sc?.status === 'inactive') disabled = true;
    });
    return disabled;
  }, [subCategoriesQuery?.data, product?.subCategory]);

  useEffect(() => {
    if (categoriesQuery.data?.status) {
      setConvertCategories(categoriesQuery.data);
    }

    if (editProduct?._id) {
      if (editProduct?.type === 'food') {
        if (editProduct?.attributes?.length) {
          setHasAttribute('yes');
        }
      }
    }
  }, []);

  // is adddon
  const isProductAddonQuery = useQuery(
    [
      Api.PRODUCT_ADDON_CHECK,
      {
        productId: editProduct?._id,
      },
    ],
    () =>
      AXIOS.get(Api.PRODUCT_ADDON_CHECK, {
        params: {
          productId: editProduct?._id,
        },
      }),
    {
      enabled: Boolean(editProduct?._id),
    },
  );

  // loading
  const __loading =
    categoriesQuery.isLoading ||
    productsQuery.isLoading ||
    (editProduct?._id && isProductAddonQuery?.isLoading) ||
    unitsQuery?.isLoading;

  // input handler
  const commonChangeHandler = (e) => {
    if (e.target.name === 'category' && shop?.shopType !== 'food') {
      setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value, subCategory: '' }));
    } else {
      setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setProduct((prev) => ({
      ...prev,
      images: newFiles?.length > 0 ? newFiles : prev.images,
    }));
  };

  // product mutation
  const productMutation = useMutation(
    (data) => {
      const _api = editProduct?._id ? Api.EDIT_PRODUCT : Api.ADD_PRODUCT;
      return AXIOS.post(_api, data);
    },
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : undefined);
        if (data?.status) {
          queryClient.invalidateQueries(['category-wise-products']);
          queryClient.invalidateQueries(['ALL_PRODUCT']);
          onClose();
        }
      },
    },
  );

  const uploadProduct = async () => {
    const productValidation = validateProduct(product, hasAttribute);
    if (!productValidation.status) {
      successMsg(productValidation?.msg);
      return;
    }

    console.log('product price', { product });

    setLoading(true);
    const productData = await createProductData(product, shop, !!editProduct?._id, hasAttribute);
    console.log('product price', { productData });

    if (productData?.status === false) {
      successMsg(productData?.message);
      setLoading(false);
      return;
    }

    productMutation.mutate({
      ...productData,
    });
    setLoading(false);
  };

  if (__loading) {
    return (
      <SidebarContainer title="Add Items" onClose={onClose}>
        <PageSkeleton />
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer
      title="Add Items"
      onClose={onClose}
      containerSx={{
        minWidth: '425px',
        maxWidth: '425px',
      }}
    >
      {shop?.shopType === 'food' && (
        <Box
          sx={{
            position: 'sticky',
            top: '75px',
            background: '#fff',
            zIndex: '999',
          }}
        >
          <Tabs
            value={currentTab}
            sx={{
              paddingBottom: 5,
            }}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
          >
            <Tab
              label="Details"
              sx={tabSx}
              onClick={() => {
                document?.getElementById('add-product-details')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
              }}
            />
            <Tab
              label="Features"
              sx={tabSx}
              onClick={() => {
                document?.getElementById('add-product-features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <Tab
              sx={tabSx}
              label="Dietary"
              onClick={() => {
                document?.getElementById('add-product-dietry')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </Tabs>
        </Box>
      )}
      {/* name */}
      <Box id="add-product-details">
        <StyledFormField
          label="Name"
          intputType="text"
          inputProps={{
            type: 'text',
            name: 'name',
            value: product.name,
            onChange: commonChangeHandler,
            readOnly: productReadonly,
          }}
        />
      </Box>
      {/* type */}
      <StyledFormField
        label="Type"
        intputType="select"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          name: 'type',
          readOnly: true,
          value: product.type,
          items: shopTypeOptions2,
          onChange: commonChangeHandler,
        }}
      />
      {/* category */}
      <StyledFormField
        label={<span>Category {isCategoryIsDisabled && <span style={{ color: '#dd5b63' }}>(Disabled)</span>}</span>}
        intputType="select"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          name: 'category',
          value: product.category,
          items: categories,
          onChange: commonChangeHandler,
          readOnly: Boolean(newProductCategory) || productReadonly,
        }}
      />
      {/* sub-category */}
      {shop?.shopType !== 'food' && (
        <StyledFormField
          label={
            <span>Sub-Category {isSubCategoryIsDisabled && <span style={{ color: '#dd5b63' }}>(Disabled)</span>}</span>
          }
          intputType="select"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            name: 'subCategory',
            value: product?.subCategory,
            items: subCategoriesQuery?.data?.data?.subCategories || [],
            onChange: commonChangeHandler,
            readOnly: productReadonly,
            disabled: subCategoriesQuery.isLoading || !product?.category,
            getLabel: (item) => item?.name,
            getKey: (item) => item?._id,
            getValue: (item) => item?._id,
            getDisplayValue: (value) =>
              subCategoriesQuery?.data?.data?.subCategories?.find((category) => category?._id === value)?.name || '',
            getDisabled: (value) => value?.status === 'inactive',
          }}
        />
      )}
      {/* description */}
      <StyledFormField
        label="Description"
        intputType="textarea"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          name: 'seoDescription',
          value: product.seoDescription,
          onChange: commonChangeHandler,
          multiline: true,
          readOnly: productReadonly,
        }}
      />
      {/* photo */}
      <StyledFormField
        label="Photo"
        intputType="file"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          onDrop,
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: product.images,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
          readOnly: productReadonly,
        }}
      />
      {/* price */}
      <StyledFormField
        label="Price"
        intputType="text"
        containerProps={{
          sx: {
            paddingTop: '14px',
            paddingBottom: '0px',
          },
        }}
        inputProps={{
          type: 'number',
          name: 'price',
          value: product.price,
          onChange: commonChangeHandler,
          readOnly: productReadonly,
        }}
      />
      {calculateSecondaryCurrency(baseCurrency, secondaryCurrency, product?.price, shop?.shopExchangeRate).enabled && (
        <Typography pt={2} variant="body3" display="block">
          Equivalent Price:
          {
            calculateSecondaryCurrency(baseCurrency, secondaryCurrency, product?.price, shop?.shopExchangeRate)
              .withOutbaseCurrency
          }
        </Typography>
      )}
      {/* attributes */}
      {shop?.shopType === 'food' && (
        <Box sx={fieldContainerSx} id="add-product-features">
          <StyledFormField
            label={
              <AttributesTitle
                isEditProduct={Boolean(editProduct?._id)}
                isAnotherProductAddon={isProductAddonQuery?.data?.data?.isAnotherProductAddon}
                products={isProductAddonQuery?.data?.data?.products}
              />
            }
            intputType="optionsSelect"
            inputProps={{
              value: hasAttribute,
              items: attributeOptions,
              onChange: (value) => {
                setHasAttribute(value);
              },
              readOnly: productReadonly || (editProduct?._id && isProductAddonQuery?.data?.data?.isAnotherProductAddon),
            }}
          />
        </Box>
      )}
      {hasAttribute === 'yes' && (
        <Box pb={4}>
          <Box pb={4}>
            {product?.attributes?.map((item, index) => (
              <AttributeItem
                attributItem={item}
                readonly={productReadonly}
                key={item?.xid}
                onChangeAttribute={(value) => {
                  product.attributes[index] = value;
                }}
                onDelete={() => {
                  product?.attributes?.splice(index, 1);
                  setRender(!render);
                }}
              />
            ))}
          </Box>
          <Button
            disableRipple
            color="primary"
            variant="text"
            startIcon={<Add />}
            sx={{
              fontSize: '14px',
              lineHeight: '17px',
            }}
            onClick={() => {
              if (productReadonly) {
                return;
              }

              product?.attributes?.push(productAttrInit());
              setRender(!render);
            }}
          >
            Add New Attribute
          </Button>
        </Box>
      )}
      {/* addons */}
      {shop?.shopType === 'food' && (
        <StyledFormField
          label="Add-ons"
          intputType="autocomplete"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            readOnly: productReadonly,
            multiple: true,
            label: 'Choose',
            maxHeight: '200px',
            options: addons,
            value: product?.addons || [],
            getOptionLabel: (option) => option?.name || '',
            isOptionEqualToValue: (option, value) => option?._id === value?._id,
            onChange: (e, v) => {
              product.addons = v.map((item) => item);
              setRender(!render);
            },
            sx: {
              '& .MuiFormControl-root': {
                minWidth: '100px',
              },
            },
            renderTags: (item, index) => (
              <StyledChip
                key={item?._id}
                label={item?.name}
                size="lg"
                onDelete={() => {
                  if (productReadonly) return;

                  product.addons.splice(index, 1);
                  setRender(!render);
                }}
              />
            ),
          }}
        />
      )}
      {/* dietry options */}
      {shop?.shopType === 'food' && (
        <Box sx={fieldContainerSx} id="add-product-dietry">
          <StyledFormField
            label="Dietary"
            intputType="optionsSelect"
            inputProps={{
              readOnly: productReadonly,
              value: product?.dietary,
              multiple: true,
              items: getDietaryOptions(shop?.shopType),
              onChange: (value) => {
                if (product?.dietary?.includes(value)) {
                  product.dietary = product?.dietary?.filter((item) => item !== value) || [];
                } else {
                  product?.dietary.push(value);
                }
                setRender(!render);
              },
            }}
          />
        </Box>
      )}
      {/*  inventory */}
      {shop?.shopType !== 'food' && (
        <Box sx={fieldContainerSx}>
          <Stack justifyContent="space-between" alignItems="center" direction="row" pb={1}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: '600',
                fontSize: '15px',
                lineHeight: '18px',
              }}
            >
              Inventory
            </Typography>
            <StyledSwitch
              checked={product?.isStockEnabled}
              readOnly={productReadonly}
              onChange={(e) => {
                if (productReadonly) {
                  return;
                }
                setProduct((prev) => ({ ...prev, isStockEnabled: e.target.checked }));
              }}
            />
          </Stack>
          {product?.isStockEnabled && (
            <Stack gap={3.5} alignItems="center" direction="row">
              <StyledInput
                value={product?.stockQuantity}
                type="number"
                readOnly={productReadonly}
                onChange={(e) => {
                  product.stockQuantity = e.target.value;
                  setRender(!render);
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '12px, 18px ',
                    maxWidth: '47px',
                    textAlign: 'center',
                  },
                }}
              />
              <Typography variant="body4">In stock</Typography>
            </Stack>
          )}
        </Box>
      )}
      {/*  unit */}
      <Box sx={fieldContainerSx}>
        <Stack justifyContent="space-between" alignItems="center" direction="row" pb={1}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '18px',
            }}
          >
            Unit
          </Typography>
          <StyledSwitch
            checked={product?.isUnitEnabled}
            readOnly={productReadonly}
            onChange={(e) => {
              if (productReadonly) {
                return;
              }
              setProduct((prev) => ({ ...prev, isUnitEnabled: e.target.checked }));
            }}
          />
        </Stack>
        {product?.isUnitEnabled && (
          <StyledFormField
            intputType="select"
            inputProps={{
              name: 'unit',
              value: product?.unit,
              items: unitsQuery?.data?.data?.appSetting?.units || [],
              onChange: commonChangeHandler,
              readOnly: productReadonly,
              disabled: unitsQuery?.isLoading,
              getLabel: (item) => item?.toUpperCase() || '',
              getKey: (item) => item,
              getValue: (item) => item,
              getDisplayValue: (value) =>
                unitsQuery?.data?.data?.appSetting?.units?.find((unit) => unit === value)?.toUpperCase() || '',
            }}
          />
        )}
      </Box>
      {/* description */}
      <StyledFormField
        label={
          <span>
            Notes
            <span
              style={{
                color: '#7E8299',
              }}
            >
              {' '}
              (only visible to you)
            </span>
          </span>
        }
        intputType="textarea"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          readOnly: productReadonly,
          name: 'note',
          value: product.note,
          onChange: commonChangeHandler,
          multiline: true,
        }}
      />
      {/* {!productReadonly && ( */}
      <Box pt={6} pb={6}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DropIcon />}
          disabled={productMutation?.isLoading || loading}
          fullWidth
          onClick={() => {
            if (productReadonly) {
              return;
            }
            uploadProduct();
          }}
        >
          Save Item
        </Button>
      </Box>
    </SidebarContainer>
  );
}
