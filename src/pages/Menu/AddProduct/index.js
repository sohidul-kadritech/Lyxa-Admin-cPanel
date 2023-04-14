// third party
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

// project import
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import { shopTypeOptions2 } from '../../../assets/staticData';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledChip from '../../../components/Styled/StyledChips';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import minInMiliSec from '../../../helpers/minInMiliSec';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import {
  attributeOptions,
  attributeTypeAvailableOptions,
  createProductData,
  dietryOptions,
  getAttrOptionsValues,
  getProductInit,
  productAttrInit,
  validateProduct,
} from '../helpers';
import PageSkeleton from './AddProductSkeleton';
import AttributeList from './AttributeList';

const fieldContainerSx = {
  padding: '14px 0',
};

export default function AddProduct({ onClose, editProduct, productReadonly, newProductCategory }) {
  const shop = useSelector((store) => store.Login.admin);
  const queryClient = useQueryClient();

  console.log('rendering');

  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [hasAttribute, setHasAttribute] = useState('');
  const [hasInventory, setHasInventory] = useState(false);

  const converEditProduct = (product) => {
    const data = {
      category: product?.category._id,
      images: product?.images?.map((url) => ({
        preview: url,
      })),
    };

    // food type
    if (product?.type === 'food') {
      if (product?.attributes?.length && product?.attributes[0]?.items?.length) {
        setHasAttribute('yes');
      }
    } else if (product?.stockQuantity !== null && product?.stockQuantity !== '') {
      setHasInventory(true);
    }

    return {
      ...product,
      ...data,
    };
  };

  const [product, setProduct] = useState(
    editProduct?._id ? converEditProduct(editProduct) : getProductInit(shop, newProductCategory)
  );

  // addons
  const productsQuery = useQuery(
    ['single-shop-products', { shopId: shop?._id }],
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
    {
      staleTime: minInMiliSec(10),
    }
  );

  // categories
  const categoriesQuery = useQuery(
    ['single-shop-category', { shopId: shop?._id }],
    () =>
      AXIOS.get(Api.GET_ALL_CATEGORY, {
        params: {
          page: 1,
          pageSize: 100,
          searchKey: '',
          sortBy: 'desc',
          status: 'active',
          type: shop?.shopType,
          userType: 'shop',
        },
      }),
    {
      staleTime: minInMiliSec(10),
      onSuccess: (data) => {
        setCategories(
          (prev) => data?.data?.categories?.map((c) => ({ value: c?.category?._id, label: c?.category?.name })) || prev
        );
      },
    }
  );

  useEffect(() => {
    if (categoriesQuery.data?.status) {
      setCategories(
        (prev) =>
          categoriesQuery.data?.data?.categories?.map((c) => ({ value: c?.category?._id, label: c?.category?.name })) ||
          prev
      );
    }
  }, []);

  // loading
  const __loading = categoriesQuery.isLoading || productsQuery.isLoading;

  // input handler
  const commonChangeHandler = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setProduct((prev) => ({
      ...prev,
      images: newFiles?.length > 0 ? newFiles : prev.images,
    }));
  };

  const attrOptionsHandler = (option) => {
    if (option.value === 'required') {
      if (product?.attributes[0]?.required !== undefined) {
        product.attributes[0].required = !product.attributes[0].required;
      }
    } else if (product?.attributes[0]?.select !== undefined) {
      product.attributes[0].select = product.attributes[0].select === 'multiple' ? '' : 'multiple';
    }
    setRender((prev) => !prev);
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
          onClose();
        }
      },
    }
  );

  const uploadProduct = async () => {
    const productValidation = validateProduct(product);
    if (!productValidation.status) {
      successMsg(productValidation?.msg);
      return;
    }

    setLoading(true);
    const productData = await createProductData(product, shop, !!editProduct?._id);

    if (productData?.status === false) {
      successMsg(productData?.message);
      setLoading(false);
      return;
    }

    productMutation.mutate({
      ...productData,
      stockQuantity: hasInventory ? product?.stockQuantity : '',
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
    <SidebarContainer title="Add Items" onClose={onClose}>
      {/* name */}
      <StyledFormField
        label="Name"
        intputType="text"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          type: 'text',
          name: 'name',
          value: product.name,
          onChange: commonChangeHandler,
          readOnly: productReadonly,
        }}
      />
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
        label="Category"
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
          accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
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
          sx: fieldContainerSx,
        }}
        inputProps={{
          type: 'number',
          name: 'price',
          value: product.price,
          onChange: commonChangeHandler,
          readOnly: productReadonly,
        }}
      />
      {/* attributes */}
      {shop?.shopType === 'food' && (
        <StyledFormField
          label="Attributes"
          intputType="optionsSelect"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            value: hasAttribute,
            items: attributeOptions,
            onChange: (value) => {
              setHasAttribute(value);
            },
            readOnly: productReadonly,
          }}
        />
      )}
      {hasAttribute === 'yes' && (
        <Box>
          <StyledFormField
            label="Attribute Title"
            intputType="text"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              type: 'text',
              readOnly: productReadonly,
              name: 'attributeTitle',
              value: product?.attributes[0] ? product?.attributes[0]?.name : '',
              onChange: (e) => {
                if (product?.attributes[0]?.name !== undefined) {
                  product.attributes[0].name = e.target.value;
                } else {
                  product.attributes.push(productAttrInit);
                }

                setRender(!render);
              },
            }}
          />
          {/* type options */}
          <StyledFormField
            intputType="checkbox"
            containerProps={{
              sx: {
                paddingBottom: '20px',
              },
            }}
            inputProps={{
              items: attributeTypeAvailableOptions,
              value: getAttrOptionsValues(product),
              onChange: attrOptionsHandler,
              readOnly: productReadonly,
            }}
          />
          {/* attribute list */}
          <AttributeList
            items={product?.attributes?.length ? product?.attributes[0]?.items : []}
            readOnly={productReadonly}
          />
        </Box>
      )}
      {shop?.shopType === 'food' && (
        <StyledFormField
          label="Add-ons"
          intputType="autocomplete"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            disabled: productReadonly,
            open: productReadonly ? false : undefined,
            multiple: true,
            label: 'Choose',
            maxHeight: '200px',
            console: console.log(product?.addons),
            options: productsQuery?.data?.data?.products || [],
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
        <StyledFormField
          label="Dietary"
          intputType="optionsSelect"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            readOnly: productReadonly,
            value: product?.dietary,
            multiple: true,
            items: dietryOptions,
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
              checked={hasInventory}
              readOnly={productReadonly}
              onChange={(e) => {
                setHasInventory(e.target.checked);
              }}
            />
          </Stack>
          {hasInventory && (
            <Stack gap={3.5} alignItems="center" direction="row">
              <StyledInput
                value={product?.stockQuantity}
                type="number"
                readOnly={productReadonly}
                onChange={(e) => {
                  console.log(product.stockQuantity);
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
