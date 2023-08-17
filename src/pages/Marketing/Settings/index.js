/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
// third party
import { Box, Button, Checkbox, FormControlLabel, InputAdornment, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// project import
import moment from 'moment';
import CloseButton from '../../../components/Common/CloseButton';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import FilterSelect from '../../../components/Filter/FilterSelect';
import OptionsSelect from '../../../components/Filter/OptionsSelect';
import StyledAccordion from '../../../components/Styled/StyledAccordion';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import { useGlobalContext } from '../../../context';
import { deepClone } from '../../../helpers/deepClone';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import BannerPreview from './BannerPreview';
import DateSliderPicker from './DateSliderPicker';
import MarketingProductsTable from './ProductsTable';
import {
  CommonTitle,
  ItemsTitle,
  confirmActionInit,
  createProductData,
  getCurrentFeaturedWeekOption,
  getDateRange,
  getDurationLeft,
  itemSelectOptions,
} from './helpers';

export default function MarketingSettings({ onClose, onDelete, marketingType, shop, creatorType }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const adminMaxDiscount = general?.appSetting?.maxDiscount;

  const theme = useTheme();
  const queryClient = useQueryClient();

  const [isPageDisabled, setIsPageDisabled] = useState(true);
  const [termAndCondition, setTermAndCondition] = useState(false);
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(confirmActionInit);
  const [serverState, setServerState] = useState({});
  const [pageMode, setPageMode] = useState(-1);
  const [isScheduled, setIsScheduled] = useState(false);
  const [entireMenu, setEntireMenu] = useState(true);

  // reward settings
  const rewardSettingsQuery = useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
    enabled: marketingType === 'reward',
  });

  const rewardAmount = rewardSettingsQuery?.data?.data?.rewardSetting?.redeemReward?.amount || 1;

  // shop products
  const productsQuery = useQuery(
    [Api.ALL_PRODUCT],
    () =>
      AXIOS.get(Api.ALL_PRODUCT, {
        params: {
          page: 1,
          pageSize: 1000,
          type: 'all',
          status: 'active',
          shop: shop?._id,
          inStock: true,
        },
      }),
    {
      enabled: false,
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
        } else if (keys.length === 1 && marketingType !== keys[0]) {
          setEntireMenu(false);
        }
      },
    },
  );

  const productOptions = useMemo(
    () =>
      (productsQuery?.data?.data?.products || []).filter(
        (p) => p.marketing === undefined || p?.marketing?.type === marketingType,
      ),
    [productsQuery?.data],
  );

  useEffect(() => {
    productsQuery.refetch();
  }, []);

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
    },
  );

  // featured settinsg
  const featuredSettingsQuery = useQuery([Api.GET_ADMIN_FEATURED_SETTINGS], () =>
    AXIOS.get(Api.GET_ADMIN_FEATURED_SETTINGS, {
      params: {
        featuredType: shop?.shopType,
      },
    }),
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

  const [dateRange, setDateRange] = useState(1);
  const [spendLimit, setSpendLimit] = useState('');
  const [products, setProducts] = useState([]);
  const [spendLimitChecked, setSpendLimitChecked] = useState(false);
  const [featuredAmount, setFeaturedDuration] = useState('');

  const setLocalData = (data) => {
    setProducts(data?.products);
    setDateRange(getDateRange(data));
    setSpendLimit(data?.spendLimit);
    setItemSelectType(data?.itemSelectionType);
    setFeaturedDuration(data?.featuredAmount);

    if (data?.spendLimit > 0) {
      setSpendLimitChecked(true);
    } else {
      setSpendLimitChecked(false);
    }
  };

  const initLocalState = (mData) => {
    setServerState(mData?.data?.marketing);
    const newData = deepClone(mData?.data?.marketing);
    setLocalData(newData);

    if (newData?.products?.length > 0) {
      setHasChanged(true);
    }
  };

  const initialize = (mData) => {
    if (mData === undefined) return;

    // does not have marketing
    if (!mData?.isMarketing) {
      setPageMode(0);
      setIsPageDisabled(false);
      return;
    }

    // does have marketing so init local state
    initLocalState(mData);

    // marketing is inactive
    if (mData?.data?.marketing?.status === 'inactive') {
      // and is featured
      if (mData?.data?.marketing?.type === 'featured') setPageMode(2);
      else setPageMode(1);

      setIsPageDisabled(true);
      return;
    }

    // marketing is active
    if (mData?.data?.marketing?.status === 'active' && mData?.data?.marketing?.isActive) {
      // setPageMode(1);
      setPageMode(2);
      setIsPageDisabled(true);
      return;
    }

    // marketing is scheduled
    if (mData?.data?.marketing?.status === 'active' && !mData?.data?.marketing?.isActive) {
      setIsScheduled(true);
      setIsPageDisabled(true);
      setPageMode(2);
      // setPageMode(1);
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
      onSuccess: (data) => {
        if (!data?.isNotEligible) {
          initialize(data);
          setQueryEnabled(false);
        } else {
          // reloads the page
          // eslint-disable-next-line no-restricted-globals, no-alert
          window.alert(
            'Looks like something has changed in marketing since you came here. We will just reload the page',
          );
          window.location.reload();
        }
      },
    },
  );

  const selectionChangeConfirm = (value) => {
    // removing previous selection information
    productOptions?.forEach((p) => {
      p.marketing = undefined;
      p.discountPercentage = 0;
      p.reward = undefined;
    });

    // common for both
    setItemSelectType(value);
    setHasChanged(false);
    setHasGlobalChange(true);
    setConfirmModal(false);

    if (value === 'single') {
      setProducts([]);
    } else {
      setGlobalRewardBundle('');
      setProducts(productOptions);
    }
  };

  const onProductSelectChange = (event) => {
    if (hasChanged && products?.length > 0) {
      setConfirmModal(true);
      setConfirmAction({
        message: 'Changing selection type will reset product list?',
        onCancel: () => setConfirmModal(false),
        onConfirm: () => selectionChangeConfirm(event.target.value),
      });
    } else {
      if (event.target.value === 'multiple') {
        setProducts(productOptions);
      } else {
        setProducts([]);
      }

      setItemSelectType(event.target.value);
      setHasGlobalChange(true);
      setHasChanged(false);
    }
  };

  const discardChanges = () => {
    const newData = deepClone(serverState);

    if (newData?.products?.length > 0) {
      setHasChanged(true);
    }

    setLocalData(newData);
    setHasGlobalChange(false);

    setIsPageDisabled(true);
    // setPageMode(1);
    setPageMode(2);
  };

  // update loyalty settings
  const marketingMutation = useMutation((data) => AXIOS.post(Api.EDIT_MARKETING_SETTINGS, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Settings successfully updated', 'success');
        queryClient.invalidateQueries([`marketing-${marketingType}-settings`]);
        queryClient.invalidateQueries([Api.ALL_PRODUCT]);
        onClose();
      }
    },
  });

  const updateLoyaltySettings = (status) => {
    // will be array if no issue else string
    const productsData = createProductData(products, {
      marketingType,
      rewardAmount,
      shopMaxDiscount: shop?.maxDiscount,
      adminMaxDiscount,
      creatorType,
    });

    if (marketingType !== 'free_delivery' && marketingType !== 'featured' && products?.length === 0) {
      successMsg('Products cannot be empty!', 'warn');
      return;
    }

    if (typeof productsData === 'string') {
      successMsg(productsData, 'warn');
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

      marketingMutation.mutate({
        shop: shop?._id,
        type: marketingType,
        creatorType,
        status: 'active',
        featuredWeek,
        featuredAmount,
      });
    } else {
      marketingMutation.mutate({
        shop: shop?._id,
        type: marketingType,
        creatorType,
        products: productsData,
        duration: {
          start: moment().format('YYYY-MM-DD'),
          end: moment()
            .add(dateRange - 1, 'days')
            .format('YYYY-MM-DD'),
        },
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
          queryClient.invalidateQueries([Api.ALL_PRODUCT]);
          onDelete();
        }
      },
    },
  );

  const shopPercentageDeals = dealSettingsQuery?.data?.data?.dealSetting?.length
    ? dealSettingsQuery?.data?.data?.dealSetting[0]?.percentageBundle
    : [];

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
            <Stack direction="row" alignItems="center" gap={4} pb={3}>
              <Typography variant="h4">
                {marketingType === 'reward' && 'Loyalty Program'}
                {marketingType === 'percentage' && 'Discounted Items'}
                {marketingType === 'double_menu' && 'Buy 1, Get 1 Free'}
                {marketingType === 'free_delivery' && '$0 Delivery fee'}
                {marketingType === 'featured' && 'Featured'}
              </Typography>
            </Stack>
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
                  disabled={isPageDisabled || productsQuery?.isLoading || !productsQuery?.data?.data}
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
                        <MarketingProductsTable
                          isFetching={productsQuery.isFetching}
                          isLoading={productsQuery?.isLoading}
                          itemSelectType={itemSelectType}
                          marketingType={marketingType}
                          productOptions={productOptions}
                          setHasGlobalChange={setHasGlobalChange}
                          setProductsChanged={setHasChanged}
                          setValues={setProducts}
                          values={products}
                          shop={shop}
                          percentageDealsOptions={shopPercentageDeals}
                          rewardAmount={rewardAmount}
                          rewardCategoryOptions={rewardSettingsQuery?.data?.data?.rewardSetting?.rewardCategory}
                          rewardDealOptions={rewardSettingsQuery.data?.data?.rewardSetting?.rewardBundle}
                          creatorType={creatorType}
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
                        ? 'Please choose the time preiod which your items will be running.'
                        : // : `${moment().format('MMMM, D, YYYY')} - ${moment().format('MMMM, D, YYYY')}`
                          `${dateRange} days left`
                    }
                  />
                }
                disabled={isPageDisabled}
              >
                <Box px={5}>
                  <DateSliderPicker
                    value={dateRange}
                    onChange={(event) => {
                      if (event.target.value === 0) return;
                      setDateRange(event.target.value);
                    }}
                  />
                </Box>
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
                    subTitle={currentExpanedTab === 2 ? 'Set your spending limit' : 'Pay per order'}
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
                    label="Set maximum spending limit"
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
                      endAdornment: <InputAdornment position="end">/total</InputAdornment>,
                    }}
                  />
                </Stack>
              </StyledAccordion>
            </Box>
          ) : (
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
                    disabled={!termAndCondition || marketingMutation.isLoading}
                    sx={{
                      borderRadius: 6,
                    }}
                    // rounded
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
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={3}>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '6px',
                    backgroundColor: '#55c086',
                    '&:hover': {
                      backgroundColor: '#47a070',
                    },
                  }}
                  disabled={marketingMutation.isLoading}
                  onClick={() => {
                    updateLoyaltySettings();
                  }}
                >
                  Resume Promotion
                </Button>
                <Button
                  disabled={loyaltySettingsDeleteMutation.isLoading}
                  variant="contained"
                  color="danger"
                  disableRipple
                  sx={{
                    borderRadius: '6px',
                  }}
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
              </Stack>
            )}
            {pageMode === 2 && (
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack alignItems="flex-start">
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
                  {marketingType === 'featured' && (
                    <Typography variant="body3" sx={{ fontSize: 12 }}>
                      *In case of delete promotion, the remaining amount is non refundable
                    </Typography>
                  )}
                </Stack>
                {marketingType !== 'featured' && (
                  <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
                    <Button
                      disabled={loyaltySettingsDeleteMutation.isLoading}
                      variant="outlined"
                      color="primary"
                      sx={{
                        borderRadius: '6px',
                      }}
                      onClick={() => {
                        setIsPageDisabled(false);
                        setPageMode(3);
                      }}
                    >
                      Edit Promotion
                    </Button>
                    {!isScheduled && (
                      <Button
                        variant="contained"
                        color="danger"
                        disabled={loyaltySettingsDeleteMutation.isLoading || marketingMutation.isLoading}
                        sx={{
                          borderRadius: '6px',
                        }}
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
                    )}
                  </Stack>
                )}
              </Stack>
            )}
            {pageMode === 3 && (
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={marketingMutation.isLoading}
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
                  disabled={marketingMutation.isLoading}
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: '6px',
                  }}
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
