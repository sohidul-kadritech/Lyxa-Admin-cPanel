/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
// third party
import { Box, Button, Checkbox, FormControlLabel, InputAdornment, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

// project import
import moment from 'moment';
import CloseButton from '../../../components/Common/CloseButton';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import FilterDate from '../../../components/Filter/FilterDate';
import FilterSelect from '../../../components/Filter/FilterSelect';
import OptionsSelect from '../../../components/Filter/OptionsSelect';
import StyledAccordion from '../../../components/Styled/StyledAccordion';
import StyledAutocomplete from '../../../components/Styled/StyledAutocomplete';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import { deepClone } from '../../../helpers/deepClone';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import BannerPreview from './BannerPreview';
import ProductTable from './ProductTable';
import {
  CommonTitle,
  GroupHeader,
  ItemsTitle,
  confirmActionInit,
  createGroupedDataRow,
  createGroupedList,
  durationInit,
  getCurrentFeaturedWeekOption,
  getDurationLeft,
  itemSelectOptions,
} from './helpers';

export default function MarketingSettings({ onClose, onDelete, marketingType, shop, creatorType }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [isPageDisabled, setIsPageDisabled] = useState(false);
  const [termAndCondition, setTermAndCondition] = useState(false);
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const [render, setRender] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(confirmActionInit);
  const [serverState, setServerState] = useState({});
  const [pageMode, setPageMode] = useState(-1);
  // eslint-disable-next-line no-unused-vars
  const [entireMenu, setEntireMenu] = useState(true);

  // reward settings
  const rewardSettingsQuery = useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
    enabled: marketingType === 'reward',
  });

  const rewardAmount = rewardSettingsQuery?.data?.data?.rewardSetting?.redeemReward?.amount || 1;

  // shop products
  const productsQuery = useQuery(
    ['shop-all-products'],
    () =>
      AXIOS.get(Api.ALL_PRODUCT, {
        params: {
          page: 1,
          pageSize: 100,
          type: 'all',
          status: 'all',
          shop: shop?._id,
        },
      }),
    {
      onSuccess: (data) => {
        const types = {};

        data?.data?.products?.forEach((product) => {
          if (product?.marketing) {
            types[product?.marketing?.type] = true;
          }
        });

        const keys = Object.keys(types);

        if (keys.length >= 2) {
          setEntireMenu(false);
        } else if (keys.length === 1) {
          if (marketingType !== keys[0]) {
            setEntireMenu(false);
          }
        }
      },
    }
  );

  // deal settings query
  const dealSettingsQuery = useQuery(
    ['deal-settings', { type: shop?.shopType === 'food' ? 'restaurant' : shop?.shopType }],
    () =>
      AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS, {
        params: {
          type: shop?.shopType === 'food' ? 'restaurant' : shop?.shopType,
        },
      }),
    {
      enabled: marketingType === 'percentage',
    }
  );

  // featured settinsg
  const featuredSettingsQuery = useQuery([Api.GET_ADMIN_FEATURED_SETTINGS], () =>
    AXIOS.get(Api.GET_ADMIN_FEATURED_SETTINGS, {
      params: {
        featuredType: shop?.shopType,
      },
    })
  );

  const featuredSettingsOptions = useMemo(() => {
    if (featuredSettingsQuery?.data?.data?.featuredSetting?.length) {
      return featuredSettingsQuery.data.data.featuredSetting[0]?.featuredItems?.map((item) => ({
        label: `${item?.featuredWeeklyDuration} week`,
        value: item?.featuredAmount,
      }));
    }

    return [];
  }, [featuredSettingsQuery?.data?.data?.featuredSetting]);

  const [itemSelectType, setItemSelectType] = useState('single');
  const [hasChanged, setHasChanged] = useState(false);
  const [globalRewardBundle, setGlobalRewardBundle] = useState();
  const [hasGlobalChange, setHasGlobalChange] = useState(false);
  const [queryEnabled, setQueryEnabled] = useState(true);

  const [duration, setDuration] = useState(durationInit);
  const [spendLimit, setSpendLimit] = useState('');
  const [products, setProducts] = useState([]);
  const [spendLimitChecked, setSpendLimitChecked] = useState(false);
  const [featuredAmount, setFeaturedDuration] = useState('');

  console.log({ featuredAmount });

  const setLocalData = (data) => {
    console.log({ data });

    setProducts(data?.products);
    setDuration(data?.duration);
    setSpendLimit(data?.spendLimit);
    setItemSelectType(data?.itemSelectionType);
    setFeaturedDuration(data?.featuredAmount);

    if (data?.spendLimit > 0) {
      setSpendLimitChecked(true);
    } else {
      setSpendLimitChecked(false);
    }
  };

  const marketingQuery = useQuery(
    [`marketing-${marketingType}-settings`],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: {
          creatorType,
          type: marketingType,
          shop: shop?._id,
        },
      }),
    {
      enabled: queryEnabled,
    }
  );

  console.log(marketingQuery?.data);

  useEffect(() => {
    if (marketingQuery?.data !== undefined) {
      if (marketingQuery?.data?.isMarketing) {
        if (marketingQuery?.data?.data?.marketing?.status === 'active') {
          setIsPageDisabled(true);
          setPageMode(1);
        } else {
          setPageMode(0);
          setIsPageDisabled(false);
        }

        setServerState(marketingQuery?.data?.data?.marketing);
        const newData = deepClone(marketingQuery?.data?.data?.marketing);
        setLocalData(newData);

        if (newData?.products?.length > 0) {
          setHasChanged(true);
        }
      } else {
        setPageMode(0);
        setIsPageDisabled(false);
      }
      setQueryEnabled(false);
    }
  }, [marketingQuery?.data]);

  const onProductSelectChange = (event) => {
    if (hasChanged && products?.length > 0) {
      // open confirm modal
      setConfirmModal(true);

      // onconfirm
      const confirmFunc = (value) => {
        if (value === 'single') {
          setProducts([]);
        } else {
          setGlobalRewardBundle('');
          setProducts(deepClone(productsQuery?.data?.data?.products || []));
        }

        setConfirmModal(false);

        setItemSelectType(value);
        setHasChanged(false);
        setHasGlobalChange(true);
      };

      setConfirmAction({
        message: 'Changing selection type will reset product list?',
        onCancel: () => setConfirmModal(false),
        onConfirm: () => confirmFunc(event.target.value),
      });
    } else {
      if (event.target.value === 'multiple') {
        setProducts(deepClone(productsQuery?.data?.data?.products || []));
      } else {
        setProducts([]);
      }

      setItemSelectType(event.target.value);
      setHasGlobalChange(true);
      setHasChanged(false);
    }
  };

  const removeProduct = (product) => {
    setProducts((prev) => prev.filter((item) => item?._id !== product?._id));
  };

  const discardChanges = () => {
    const newData = deepClone(serverState);
    if (newData?.products?.length > 0) {
      setHasChanged(true);
    }

    setLocalData(newData);
    setHasGlobalChange(false);

    setIsPageDisabled(true);
    setPageMode(1);
  };

  // update loyalty settings
  const loyaltySettingsMutaion = useMutation((data) => AXIOS.post(Api.EDIT_MARKETING_SETTINGS, data), {
    onSuccess: (data, args) => {
      if (data?.status) {
        setServerState((prev) => data?.data?.marketing || prev);
        successMsg('Settings successfully updated', 'success');

        if (data?.data?.marketing?.products?.length > 0) {
          setHasChanged(true);
        }

        setHasGlobalChange(false);

        queryClient.invalidateQueries([`marketing-${marketingType}-settings`]);
        queryClient.invalidateQueries([`shop-all-products`]);

        if (args.status === 'inactive') {
          setPageMode(0);
          setIsPageDisabled(false);
        } else {
          setPageMode(1);
          setIsPageDisabled(true);
        }
      }
    },
  });

  const updateLoyaltySettings = (status) => {
    let prb = null;

    // eslint-disable-next-line array-callback-return, consistent-return
    const productsData = products.map((item) => {
      // reward
      if (!item?._id) {
        prb = 'Please remove empty items from list!';
      }

      if (marketingType === 'reward' && !item?.rewardCategory) {
        prb = 'Please select category for product!';
      }

      if (marketingType === 'reward' && !item?.rewardBundle) {
        prb = 'Please select reward bundle for product!';
      }

      if (marketingType === 'reward') {
        return {
          id: item?._id,
          rewardCategory: item?.rewardCategory,
          rewardBundle: item?.rewardBundle,
          reward: {
            amount: Math.round(item.price - (item?.price / 100) * item?.rewardBundle),
            points: Math.round(((item?.price / 100) * item?.rewardBundle) / rewardAmount),
          },
        };
      }

      // percentage
      if (marketingType === 'percentage' && !item?.discountPercentage) {
        prb = 'Please select percentage bundle for product!';
      }

      if (marketingType === 'percentage') {
        const discountAmount = (item?.price / 100) * item?.discountPercentage;
        return {
          id: item?._id,
          discountPercentage: item?.discountPercentage,
          discountPrice:
            item?.price - (shop?.maxDiscount > 0 ? Math.min(discountAmount, shop?.maxDiscount) : discountAmount),
          discount: shop?.maxDiscount > 0 ? Math.min(discountAmount, shop?.maxDiscount) : discountAmount,
        };
      }

      return {
        id: item?._id,
      };
    });

    if (marketingType !== 'free_delivery' && marketingType !== 'featured' && products?.length === 0) {
      successMsg('Products cannot be empty!', 'warn');
      return;
    }

    if (prb) {
      successMsg(prb, 'warn');
      return;
    }

    if (new Date(duration.end).getTime() < new Date().getTime()) {
      successMsg('Invalid end date', 'warn');
      return;
    }

    if (new Date(duration.end).getTime() < new Date(duration.start).getTime()) {
      successMsg('Invalid start date', 'warn');
      return;
    }

    if (spendLimitChecked && !Number(spendLimit)) {
      successMsg('Invalid spend limit', 'warn');
      return;
    }

    if (marketingType === 'featured' && !featuredAmount) {
      successMsg('Select duration first!', 'warn');
      return;
    }

    if (marketingType === 'featured') {
      const featuredWeek = featuredSettingsOptions
        ?.find((item) => item?.value === Number(featuredAmount))
        ?.label?.slice(0, 1);

      loyaltySettingsMutaion.mutate({
        shop: shop?._id,
        type: marketingType,
        creatorType,
        status: 'active',
        featuredWeek,
        featuredAmount,
      });
    } else {
      loyaltySettingsMutaion.mutate({
        shop: shop?._id,
        type: marketingType,
        creatorType,
        products: productsData,
        duration,
        spendLimit: spendLimitChecked ? spendLimit : 0,
        status: status || 'active',
        itemSelectionType: itemSelectType,
      });
    }
  };

  const loyaltySettingsDeleteMutation = useMutation(
    () =>
      AXIOS.post(Api.DELETE_MARKETING_SETTINGS, {
        marketingId: serverState?._id,
        shopId: shop?._id,
        creatorType,
      }),
    {
      onSuccess: (data) => {
        successMsg(data?.message, 'success');

        if (data?.status) {
          queryClient.removeQueries([`marketing-${marketingType}-settings`]);
          queryClient.invalidateQueries([`shop-all-products`]);

          onDelete();
        }
      },
    }
  );

  const shopPercentageDeals = dealSettingsQuery?.data?.data?.dealSetting?.length
    ? dealSettingsQuery?.data?.data?.dealSetting[0]?.percentageBundle
    : [];

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
            disabled={productsQuery.isLoading || itemSelectType === 'multiple'}
            options={createGroupedList(productsQuery?.data?.data?.products || [], params?.row?.category?.name)}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            onChange={(event, newValue) => {
              const index = products.findIndex((item) => item?._id === params.row?._id);
              products[index] = newValue;
              setRender(!render);
              setHasChanged(true);
              setHasGlobalChange(true);
            }}
            getOptionLabel={(option) => option?.name || 'Select Product'}
            getOptionDisabled={(option) => !!products?.find((item) => item?._id === option?._id)}
            loading={productsQuery.isLoading || productsQuery.isFetching}
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
          return <></>;
        }

        return (
          <FilterSelect
            items={
              marketingType === 'percentage'
                ? shopPercentageDeals
                : rewardSettingsQuery.data?.data?.rewardSetting?.rewardBundle || []
            }
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
              setHasChanged(true);
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
          return <></>;
        }

        return (
          <FilterSelect
            items={rewardSettingsQuery?.data?.data?.rewardSetting?.rewardCategory || []}
            disabled={!params.row?.price}
            value={params.row?.rewardCategory || ''}
            getKey={(item) => item?._id}
            getValue={(item) => item?._id}
            getLabel={(item) => item?.name}
            getDisplayValue={(value) =>
              rewardSettingsQuery?.data?.data?.rewardSetting?.rewardCategory?.find((item) => item?._id === value)
                ?.name || ''
            }
            placeholder="Select Category"
            onChange={(e) => {
              params.row.rewardCategory = e.target.value;
              setRender(!render);
              setHasChanged(true);
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
                <Typography variant="body1" color={theme.palette.primary.main}>
                  {Math.round(((params?.row?.price / 100) * params?.row?.rewardBundle) / rewardAmount)} Pts + {currency}{' '}
                  {Math.round(params?.row?.price - (params?.row?.price / 100) * params.row.rewardBundle)}
                </Typography>
              )}
              {/* percentage */}
              {marketingType === 'percentage' && (
                <Typography variant="body1" color={theme.palette.text.danger}>
                  {currency}{' '}
                  {(
                    params?.row?.price -
                    (shop?.maxDiscount > 0 ? Math.min(discountAmount, shop?.maxDiscount) : discountAmount)
                  )?.toFixed(2)}{' '}
                </Typography>
              )}
              {/* double_menu */}
              {marketingType === 'double_menu' && (
                <Typography variant="body1" color={theme.palette.text.danger}>
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
                  setHasChanged(true);
                }}
              />
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          lg: '1fr 305px',
          md: '1fr 250px',
        },
        position: 'relative',
        height: '100%',
      }}
    >
      <CloseButton
        color="primary"
        size="sm"
        sx={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          zIndex: '99',
        }}
        onClick={() => {
          if (hasGlobalChange) {
            setConfirmModal(true);
            setConfirmAction({
              message: 'You have unsaved changes, discard?',
              onCancel: () => setConfirmModal(false),
              onConfirm: () => onClose(),
            });
          } else {
            onClose();
          }
        }}
      />
      {/* overlay */}
      {marketingQuery.isLoading && <LoadingOverlay />}
      {/* left */}
      <Box
        sx={{
          padding: {
            lg: '0 36px 36px 36px',
            md: '0 20px 20px 20px',
          },
          borderRight: `1px solid ${theme.palette.custom.border}`,
          minHeight: '0',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'scroll',
        }}
      >
        <Box>
          <Box
            sx={{
              position: 'sticky',
              top: '0',
              zIndex: '9999',
              background: '#fff',
              paddingTop: {
                lg: '36px',
                md: '20px',
              },
            }}
            pb={2}
          >
            <Typography variant="h4" pb={3}>
              {marketingType === 'reward' && 'Loyalty Program'}
              {marketingType === 'percentage' && 'Discounted Items'}
              {marketingType === 'double_menu' && 'Buy 1, Get 1 Free'}
              {marketingType === 'free_delivery' && '$0 Delivery fee'}
              {marketingType === 'featured' && 'Featured'}
            </Typography>
            <Typography variant="body2" color={theme.palette.text.primary2}>
              {marketingType === 'reward' &&
                'Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on an item, giving them more incentive to order from your business.'}
              {marketingType === 'percentage' &&
                'Provide a percentage discount for specific menu items or categories, allowing customers to save money while ordering their favorite dishes.'}
              {marketingType === 'double_menu' &&
                "Offer a 'buy one, get one free' promotion for up to 10 items, giving customers a chance to try new items without extra cost"}
              {marketingType === 'free_delivery' &&
                'Cover the entire delivery fee charged to the customer as a way to encourage customers to order from your business, and drive sales.'}
              {marketingType === 'featured' &&
                "Feature your restaurant profile on the homepage in the 'Featured' section to increase visibility and attract more customers."}
            </Typography>
          </Box>
          {marketingType !== 'featured' ? (
            <Box>
              {/* products */}
              {marketingType !== 'free_delivery' && (
                <StyledAccordion
                  Title={<ItemsTitle />}
                  isOpen={currentExpanedTab === 0}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 0 : -1);
                  }}
                  disabled={isPageDisabled || productsQuery?.isLoading}
                >
                  <Box position="relative">
                    <StyledRadioGroup
                      color="primary"
                      items={itemSelectOptions.filter((item) => entireMenu || item.value !== 'multiple')}
                      value={itemSelectType}
                      onChange={onProductSelectChange}
                    />
                    {itemSelectType === 'multiple' && (marketingType === 'reward' || marketingType === 'percentage') && (
                      <Box
                        sx={{
                          position: 'absolute',
                          zIndex: '99',
                          bottom: '-6px',
                          left: '130px',
                        }}
                      >
                        <FilterSelect
                          items={
                            marketingType === 'reward'
                              ? rewardSettingsQuery.data?.data?.rewardSetting?.rewardBundle || []
                              : shopPercentageDeals || []
                          }
                          placeholder={marketingType === 'reward' ? '0%' : 'Select Percentage'}
                          getKey={(item) => item}
                          getValue={(item) => item}
                          getLabel={(item) => item}
                          getDisplayValue={(value) => `${value}`}
                          onChange={(e) => {
                            products.forEach((product) => {
                              if (marketingType === 'reward') {
                                product.rewardBundle = Number(e.target.value);
                              } else {
                                product.discountPercentage = Number(e.target.value);
                              }
                            });
                            setGlobalRewardBundle(Number(e.target.value));
                            setHasChanged(true);
                            setHasGlobalChange(true);
                          }}
                          value={globalRewardBundle}
                          sx={{
                            minWidth: '80px',
                            '& .MuiInputBase-input': {
                              fontWeight: '500',
                              fontSize: '15px',
                              lineHeight: '24px',
                              paddingTop: '6px',
                              paddingBottom: '6px',
                              textAlign: 'center',
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box pt={5}>
                    <Box
                      sx={{
                        overflowX: 'scroll',
                      }}
                    >
                      <Box
                        sx={{
                          minHeight: '0px',
                          height: `${products?.length > 0 ? '500px' : '200px'}`,
                          minWidth: '850px',
                        }}
                      >
                        <ProductTable
                          columns={allColumns.filter((column) => column.showFor.includes(marketingType))}
                          rows={createGroupedDataRow(products || [])}
                        />
                      </Box>
                    </Box>
                    {/* add new */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        paddingTop: '20px',
                      }}
                    >
                      <Button
                        disableRipple
                        className={`${products.length < productsQuery?.data?.data?.products?.length ? '' : 'd-none'}`}
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setProducts((prev) => [...prev, { _id: `${Math.random()}` }]);
                          setHasChanged(true);
                          setHasGlobalChange(true);
                        }}
                      >
                        + Add items
                      </Button>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: '500',
                          fontSize: '13px',
                          lineHeight: '16px',
                        }}
                      >
                        {products?.length} items
                      </Typography>
                    </Stack>
                  </Box>
                </StyledAccordion>
              )}
              {/* duration */}
              <StyledAccordion
                isOpen={currentExpanedTab === 1}
                onChange={(closed) => {
                  seCurrentExpanedTab(closed ? 1 : -1);
                }}
                Title={
                  <CommonTitle
                    title="Duration"
                    subTitle={
                      currentExpanedTab === 1
                        ? 'Please choose the date range during which your items will be running.'
                        : `${moment(duration.start).format('MMMM, D, YYYY')} - ${moment(duration.end).format(
                            'MMMM, D, YYYY'
                          )}`
                    }
                  />
                }
                // sx={isPageDisabled ? disabledSx : {}}
                disabled={isPageDisabled}
              >
                <Stack direction="row" alignItems="center" gap={5} pt={1}>
                  <Stack gap={2.5}>
                    <Typography variant="body2">Start Date</Typography>
                    <FilterDate
                      maxDate={moment(duration.end).subtract(1, 'day')}
                      value={duration.start}
                      onChange={(e) => {
                        setDuration((prev) => ({ ...prev, start: e._d }));
                        setHasGlobalChange(true);
                      }}
                    />
                  </Stack>
                  <Stack gap={2.5}>
                    <Typography variant="body2">End Date</Typography>
                    <FilterDate
                      minDate={moment(duration.start).add(1, 'day')}
                      value={duration.end}
                      onChange={(e) => {
                        setDuration((prev) => ({ ...prev, end: e._d }));
                        setHasGlobalChange(true);
                      }}
                    />
                  </Stack>
                </Stack>
              </StyledAccordion>
              {/* spend limit */}
              <StyledAccordion
                isOpen={currentExpanedTab === 2}
                onChange={(closed) => {
                  seCurrentExpanedTab(closed ? 2 : -1);
                }}
                Title={
                  <CommonTitle
                    title="Spend Limit"
                    subTitle={currentExpanedTab === 2 ? 'Set your weekly spending limit' : 'Pay per order'}
                  />
                }
                disabled={isPageDisabled}
              >
                <Stack direction="row" alignItems="center" gap={5} pt={1}>
                  <FormControlLabel
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: '500',
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: theme.palette.text.danger,
                      },
                    }}
                    label="Set maximum weekly spending limit"
                    control={
                      <Checkbox
                        sx={{
                          '&.Mui-checked': {
                            color: theme.palette.text.danger,
                          },
                        }}
                        checked={spendLimitChecked}
                        onChange={(event) => {
                          setSpendLimitChecked(event.target.checked);
                          setHasGlobalChange(true);
                        }}
                      />
                    }
                  />
                  <StyledInput
                    type="number"
                    sx={{
                      width: '100%',
                      maxWidth: '280px',

                      '& .MuiInputBase-root': {
                        padding: '12px 17px 12px 22px',
                      },

                      '& .MuiInputBase-input': {
                        padding: 0,
                        textAlign: 'left',

                        '&::placeholder': {
                          opacity: 1,
                          color: '#737373',
                        },
                      },

                      '& .MuiTypography-root': {
                        fontWeight: '500',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: theme.palette.text.danger,
                      },

                      '& .MuiInputAdornment-positionStart': {
                        p: {
                          paddingRight: '6px',
                        },
                      },
                    }}
                    disabled={!spendLimitChecked}
                    placeholder="Max amount"
                    value={spendLimit}
                    onChange={(event) => {
                      setSpendLimit(event.target.value);
                      setHasGlobalChange(true);
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      endAdornment: <InputAdornment position="end">/week</InputAdornment>,
                    }}
                  />
                </Stack>
              </StyledAccordion>
            </Box>
          ) : (
            /* duration */
            <Box>
              <StyledAccordion
                isOpen={marketingQuery?.data?.isMarketing || currentExpanedTab === 0}
                onChange={(closed) => {
                  seCurrentExpanedTab(closed ? 0 : -1);
                }}
                Title={
                  <CommonTitle
                    title="Duration"
                    subTitle="Choose the time period during which your items will be featured."
                  />
                }
                disabled={isPageDisabled || featuredSettingsQuery.isLoading}
              >
                <OptionsSelect
                  items={
                    marketingQuery?.data?.isMarketing
                      ? [getCurrentFeaturedWeekOption(marketingQuery?.data)]
                      : featuredSettingsOptions
                  }
                  value={featuredAmount}
                  onChange={(value) => {
                    setFeaturedDuration(value);
                  }}
                />
              </StyledAccordion>
              {/* featured spend amount */}
              <Stack direction="row" alignItems="center" gap={15}>
                <Stack gap={2} pt={5}>
                  <Typography variant="body1" fontWeight={600}>
                    Amount
                  </Typography>
                  <Typography variant="h5" fontSize={32} lineHeight={1}>
                    {currency} {featuredAmount || 0}
                  </Typography>
                </Stack>
                {marketingQuery?.data?.isMarketing && (
                  <Stack gap={2} pt={5}>
                    <Typography variant="body1" fontWeight={600}>
                      Time Remaining
                    </Typography>
                    <Typography
                      variant="h5"
                      fontSize={32}
                      lineHeight={1}
                      color={
                        marketingQuery?.data?.data?.marketing?.status === 'inactive'
                          ? theme.palette.error.main
                          : undefined
                      }
                    >
                      {getDurationLeft(marketingQuery?.data?.data?.marketing?.duration?.end) || '0 days 0 hours'}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              {marketingQuery?.data?.data?.marketing?.status === 'inactive' && (
                <Typography variant="body1" fontWeight={500} mt={10} maxWidth="650px" color={theme.palette.error.main}>
                  Your featrued campaign is over, if you wish to start a new campaign. Please delete this campaign and
                  add a new one.
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {!marketingQuery.isLoading && (
          <Box
            sx={{
              paddingTop: '70px',
            }}
          >
            {pageMode === 0 && (
              <>
                {marketingType === 'free_delivery' && (
                  <Box pb={8}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#363636',
                      }}
                    >
                      In your market, the average cost of delivery for an order is €1.66, and the maximum delivery fee
                      per order that you will be charged is €5.99. The minimum basket size is predetermined by Lyxa, but
                      you have the ability to make changes to this campaign before it begins.
                    </Typography>
                  </Box>
                )}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      marginLeft: '-11px',
                    }}
                  >
                    <Checkbox
                      sx={{
                        '&.Mui-checked': {
                          color: theme.palette.text.danger,
                        },
                      }}
                      checked={termAndCondition}
                      onChange={(e) => {
                        setTermAndCondition(e.target.checked);
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: '20px',
                        color: '#404040',
                        marginRight: '6px',
                      }}
                    >
                      I accept
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: '20px',
                        color: theme.palette.primary.main,
                      }}
                    >
                      Terms & Conditions
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!termAndCondition || loyaltySettingsMutaion.isLoading}
                    rounded
                    onClick={() => {
                      updateLoyaltySettings();
                    }}
                  >
                    Activate Promotion
                  </Button>
                </Stack>
              </>
            )}
            {pageMode === 1 && (
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Button
                    disabled={loyaltySettingsDeleteMutation.isLoading}
                    variant="text"
                    color="danger"
                    disableRipple
                    onClick={() => {
                      setConfirmModal(true);
                      setConfirmAction({
                        message:
                          marketingType === 'featured' && marketingQuery?.data?.data?.marketing?.status === 'active'
                            ? `Deleting this campaign will not refund your ${currency} ${featuredAmount} ?`
                            : 'Are you sure?. Your campaign will be deleted.',
                        onCancel: () => setConfirmModal(false),
                        onConfirm: () => {
                          loyaltySettingsDeleteMutation.mutate();
                          setConfirmModal(false);
                        },
                      });
                    }}
                  >
                    Delete Promotion
                  </Button>
                </Box>
                {marketingType !== 'featured' && (
                  <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
                    <Button
                      variant="outlined"
                      color="primary"
                      rounded
                      disabled={loyaltySettingsDeleteMutation.isLoading}
                      onClick={() => {
                        setIsPageDisabled(false);
                        setPageMode(2);
                      }}
                    >
                      Edit Promotion
                    </Button>
                    <Button
                      variant="contained"
                      color="danger"
                      disabled={loyaltySettingsDeleteMutation.isLoading || loyaltySettingsMutaion.isLoading}
                      rounded
                      onClick={() => {
                        setConfirmModal(true);
                        setConfirmAction({
                          message: 'Are you sure?. Your campaign will be deactivaed.',
                          onCancel: () => setConfirmModal(false),
                          onConfirm: () => {
                            updateLoyaltySettings('inactive');
                            setConfirmModal(false);
                          },
                        });
                      }}
                    >
                      Pause Promotion
                    </Button>
                  </Stack>
                )}
              </Stack>
            )}
            {pageMode === 2 && (
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={loyaltySettingsMutaion.isLoading}
                  onClick={() => {
                    if (hasGlobalChange) {
                      setConfirmModal(true);
                      setConfirmAction({
                        message: 'All your changes will be lost, Discard?',
                        onCancel: () => setConfirmModal(false),
                        onConfirm: () => {
                          discardChanges();
                          setConfirmModal(false);
                        },
                      });
                    } else {
                      discardChanges();
                    }
                  }}
                >
                  Discard Changes
                </Button>
                <Button
                  disabled={loyaltySettingsMutaion.isLoading}
                  variant="contained"
                  color="primary"
                  rounded
                  onClick={() => {
                    updateLoyaltySettings();
                  }}
                >
                  Save Changes
                </Button>
              </Stack>
            )}
          </Box>
        )}
      </Box>
      {/* right */}
      <Box
        sx={{
          padding: {
            lg: '36px',
            md: '20px',
          },
        }}
      >
        <Typography variant="h4" pb={8}>
          Preview
        </Typography>
        <BannerPreview
          shopBanner={shop?.shopBanner}
          shopLogo={shop?.shopLogo}
          shopName={shop?.shopName}
          marketingType={marketingType}
        />
      </Box>
      <ConfirmModal
        message={confirmAction.message}
        isOpen={confirmModal}
        blurClose
        onCancel={confirmAction.onCancel}
        onConfirm={confirmAction.onConfirm}
      />
    </Box>
  );
}
