/* eslint-disable max-len */
/* eslint-disable no-unsafe-optional-chaining */
import { Stack, Typography } from '@mui/material';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledAutocomplete from '../../../components/Styled/StyledAutocomplete';
import { useGlobalContext } from '../../../context';
import ProductTable from './ProductTable';
import { GroupHeader, createGroupedDataRow } from './helpers';

/*
isLoading = isLoading;
isFetching = isFetching;
transformedProducts = productOptions
products = values;
setProducts = setValues
setProductsChanged = setProductsChanged
shopPercentageDeals = percentageDealsOptions
rewardSettingsQuery.data?.data?.rewardSetting?.rewardBundle = rewardDealOptions
rewardSettingsQuery?.data?.data?.rewardSetting?.rewardCategory = rewardCategoryOptions
*/

export default function MarketingProductsTable({
  marketingType,
  isLoading,
  isFetching,
  itemSelectType,
  productOptions,
  values,
  setValues,
  setProductsChanged,
  setHasGlobalChange,
  shop,
  percentageDealsOptions = [],
  rewardAmount,
  rewardDealOptions = [],
  rewardCategoryOptions,
}) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const [render, setRender] = useState(false);

  const removeProduct = (product) => {
    product.marketing = undefined;
    product.discountPercentage = 0;
    product.reward = undefined;
    setValues((prev) => prev.filter((item) => item?._id !== product?._id));
  };

  const groupedProductList = useMemo(
    () => Object.values(_.groupBy(productOptions || [], (product) => product?.category?.name)).flat(),
    [productOptions]
  );

  const allColumns = [
    {
      id: 1,
      showFor: ['reward', 'percentage', 'double_menu'],
      headerName: `Item`,
      sortable: false,
      field: 'product',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          return (
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: '#737373',
                fontStyle: 'italic',
                pl: 1.5,
              }}
            >
              {params?.row?.categoryName !== 'undefined' ? params?.row?.categoryName : 'Select'}
            </Typography>
          );
        }

        return (
          <StyledAutocomplete
            fullWidth
            value={params.row}
            disabled={isLoading || itemSelectType === 'multiple'}
            readOnly={isLoading || itemSelectType === 'multiple'}
            options={groupedProductList.filter(
              (item) => !params?.row?.category?.name || item?.category?.name === params?.row?.category?.name
            )}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            onChange={(event, newValue) => {
              const index = values.findIndex((item) => item?._id === params.row?._id);
              values[index] = newValue;
              setRender(!render);
              setProductsChanged(true);
              setHasGlobalChange(true);
            }}
            getOptionLabel={(option) => option?.name || 'Select Product'}
            getOptionDisabled={(option) => !!values?.find((item) => item?._id === option?._id)}
            isLoading={isLoading || isFetching}
            groupBy={(option) => option?.category?.name}
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <ul
                  style={{
                    padding: 0,
                  }}
                >
                  {params.children}
                </ul>
              </li>
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <span>{option?.name}</span>
                <span>
                  {currency} {option?.price}
                </span>
              </li>
            )}
          />
        );
      },
    },
    {
      id: 2,
      headerName: `Point Percentage`,
      showFor: ['reward', 'percentage'],
      sortable: false,
      field: 'rewardBundle',
      flex: 1,
      align: 'left',
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          // eslint-disable-next-line react/jsx-no-useless-fragment
          return <></>;
        }

        return (
          <FilterSelect
            items={marketingType === 'percentage' ? percentageDealsOptions : rewardDealOptions || []}
            placeholder="Select Percentage"
            disabled={!params.row?.price}
            getKey={(item) => item}
            getValue={(item) => item}
            getLabel={(item) => item}
            getDisplayValue={(value) => `${value}`}
            onChange={(e) => {
              if (marketingType === 'percentage') {
                params.row.discountPercentage = Number(e.target.value);
              } else {
                params.row.rewardBundle = Number(e.target.value);
              }
              setRender(!render);
              setProductsChanged(true);
              setHasGlobalChange(true);
            }}
            value={
              marketingType === 'percentage' ? params?.row?.discountPercentage || '' : params.row?.rewardBundle || ''
            }
          />
        );
      },
    },
    {
      id: 3,
      headerName: `Category`,
      showFor: ['reward'],
      sortable: false,
      field: 'rewardCategory',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          // eslint-disable-next-line react/jsx-no-useless-fragment
          return <></>;
        }

        return (
          <FilterSelect
            items={rewardCategoryOptions || []}
            disabled={!params.row?.price}
            value={params.row?.rewardCategory || ''}
            getKey={(item) => item?._id}
            getValue={(item) => item?._id}
            getLabel={(item) => item?.name}
            getDisplayValue={(value) => rewardCategoryOptions?.find((item) => item?._id === value)?.name || ''}
            placeholder="Select Category"
            onChange={(e) => {
              params.row.rewardCategory = e.target.value;
              setRender(!render);
              setProductsChanged(true);
              setHasGlobalChange(true);
            }}
          />
        );
      },
    },
    {
      id: 5,
      headerName: `Final Price`,
      showFor: ['reward', 'percentage', 'double_menu'],
      sortable: false,
      field: 'calc',
      flex: 1,
      align: marketingType === 'double_menu' ? 'center' : 'left',
      headerAlign: marketingType === 'double_menu' ? 'center' : 'left',
      minWidth: 180,
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          // eslint-disable-next-line react/jsx-no-useless-fragment
          return <></>;
        }

        if (
          marketingType === 'reward' &&
          !(params?.row?.price && params?.row?.rewardBundle && rewardAmount !== undefined)
        ) {
          return <>--</>;
        }

        if (marketingType === 'percentage' && !params?.row?.discountPercentage) {
          return <>--</>;
        }

        if (marketingType === 'double_menu' && !params?.row?.price) {
          return <>--</>;
        }

        // for percentage only
        const discountAmount = (params?.row?.price / 100) * params?.row?.discountPercentage;

        return (
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              {/* reward */}
              {marketingType === 'reward' && (
                <Typography variant="body1" color="primary.main">
                  {Math.round(((params?.row?.price / 100) * params?.row?.rewardBundle) / rewardAmount)} Pts + {currency}{' '}
                  {(params?.row?.price - (params?.row?.price / 100) * params.row.rewardBundle).toFixed(2)}
                </Typography>
              )}
              {/* percentage */}
              {marketingType === 'percentage' && (
                <Typography variant="body1" color="text.danger">
                  {currency}{' '}
                  {(
                    params?.row?.price -
                    (shop?.maxDiscount > 0 ? Math.min(discountAmount, shop?.maxDiscount) : discountAmount)
                  )?.toFixed(2)}{' '}
                </Typography>
              )}
              {/* double_menu */}
              {marketingType === 'double_menu' && (
                <Typography variant="body1" color="text.danger">
                  {currency} {params?.row?.price}
                </Typography>
              )}
              {/* second */}
              <Typography
                sx={{
                  color: '#A3A3A3',
                  fontWeight: 500,
                  textDecoration: 'line-through',
                }}
                variant="body1"
              >
                {/* reward/percentage  */}
                {marketingType === 'reward' || (marketingType === 'percentage' && `${currency} ${params?.row?.price}`)}
                {/* double_menu */}
                {marketingType === 'double_menu' && `${currency} ${params?.row?.price * 2} `}
              </Typography>
            </Stack>
            {itemSelectType !== 'multiple' && (
              <CloseButton
                color="primary"
                size="sm"
                onClick={() => {
                  removeProduct(params.row);
                  setProductsChanged(true);
                }}
              />
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <ProductTable
      columns={allColumns.filter((column) => column.showFor.includes(marketingType))}
      rows={createGroupedDataRow(values || [])}
    />
  );
}