/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import { shopTypeOptions2 } from '../../../assets/staticData';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledChip from '../../../components/Styled/StyledChips';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import { getImageUrl } from '../../../helpers/images';
import minInMiliSec from '../../../helpers/minInMiliSec';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { attributeOptions, attributeTypeAvailableOptions, dietryOptions, productInit } from '../helpers';
import AttributeList from './AttributeList';

const fieldContainerSx = {
  padding: '14px 0',
};

const attr = {
  name: '',
  required: false,
  select: '',
  items: [],
};

const getAttrOptionsValues = (product) => {
  const values = [];
  if (product?.attributes[0] && product?.attributes[0]?.required) values.push('required');
  if (product?.attributes[0] && product?.attributes[0]?.select === 'multiple') values.push('multiple');
  return values;
};

const getCateogryInit = (shop, category) => {
  const data = { ...productInit };
  // type
  data.type = shop?.shopType || '';
  data.shop = shop?._id || '';
  // category
  return data;
};

export default function AddProduct({ onClose, editProduct, viewOnly, category }) {
  const shop = useSelector((store) => store.Login.admin);
  const queryClient = useQueryClient();

  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState(editProduct || getCateogryInit(shop, category));
  const [hasAttribute, setHasAttribute] = useState('');
  const [hasInventory, setHasInventory] = useState(false);

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

  console.log(categoriesQuery.data);

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

  // input handler
  const commonChangeHandler = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // file handler
  const onDrop = (acceptedFiles, rejectedFiles) => {
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
      const _api = editProduct ? Api.EDIT_PRODUCT : Api.ADD_PRODUCT;
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

  const updateProduct = async () => {
    setLoading(true);
    const imgUrl = await getImageUrl(product?.images[0]);

    if (!imgUrl) {
      setLoading(false);
      return;
    }

    // variant props
    let stockQuantity = product?.stockQuantity;
    let addons = product?.addons;
    let attribute = product?.attribute;
    let dietry = product?.dietry;

    if (shop?.shopType === 'food') {
      stockQuantity = undefined;
      addons = product?.addons?.map((p) => p?._id);
    } else {
      dietry = undefined;
      addons = undefined;
      attribute = undefined;
    }

    productMutation.mutate({
      ...product,
      dietry,
      addons,
      attribute,
      stockQuantity,
      images: [imgUrl],
    });

    setLoading(false);
  };

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
              name: 'attributeTitle',
              value: product?.attributes[0] ? product?.attributes[0]?.name : '',
              onChange: (e) => {
                if (product?.attributes[0]?.name !== undefined) {
                  product.attributes[0].name = e.target.value;
                } else {
                  product.attributes.push(attr);
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
            }}
          />
          {/* attribute list */}
          <AttributeList items={product?.attributes?.length ? product?.attributes[0]?.items : []} onDelete={() => {}} />
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
            multiple: true,
            label: 'Choose',
            maxHeight: '200px',
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
                readOnly={false}
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
          // disabled={productMutation?.isLoading || loading}
          fullWidth
          onClick={() => {
            updateProduct();
          }}
        >
          Save Item
        </Button>
      </Box>
    </SidebarContainer>
  );
}
