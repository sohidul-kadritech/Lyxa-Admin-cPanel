/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
// third party
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

// project import
import moment from 'moment';
import CloseButton from '../../../components/Common/CloseButton';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import ProductSelect from '../../../components/Common/ProductSelect';
import FilterDate from '../../../components/Filter/FilterDate';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledAccordion from '../../../components/Styled/StyledAccordion';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import StyledTable2 from '../../../components/Styled/StyledTable2';
import { deepClone } from '../../../helpers/deepClone';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import BannerPreview from './BannerPreview';

// helper functions
const createGroupedList = (products, category) => {
  const productsList = Object.values(_.groupBy(products || [], (product) => product?.category?.name)).flat();
  return productsList.filter((item) => !item?.marketing && (!category || item?.category?.name === category));
};

const createGroupedDataRow = (products) => {
  const categoryMap = {};
  const result = [];

  products.forEach((item) => {
    if (categoryMap[item?.category?.name] === undefined) {
      categoryMap[item?.category?.name] = [item];
    } else {
      categoryMap[item?.category?.name].push(item);
    }
  });

  Object.entries(categoryMap).forEach((category, index) => {
    result.push({ _id: `c-${index}`, isCategoryHeader: true, categoryName: category[0] });
    result.push(...category[1]);
  });

  return result;
};

// helper components
function ItemsTitle() {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" gap={2.5}>
      <Typography
        variant="body1"
        color={theme.palette.text.primary}
        sx={{
          lineHeight: '19px',
          fontWeight: 600,
        }}
      >
        Items
      </Typography>
      <span
        style={{
          fontWeight: '500',
          fontSize: '11px',
          lineHeight: '20px',
          color: theme.palette.primary.main,
        }}
      >
        Required
      </span>
    </Stack>
  );
}

function CommonTitle({ title, subTitle }) {
  const theme = useTheme();

  return (
    <Stack gap={1.5}>
      <Typography
        variant="body1"
        color={theme.palette.text.primary}
        sx={{
          lineHeight: '19px',
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <span
        style={{
          fontWeight: '500',
          fontSize: '14px',
          lineHeight: '17px',
          color: '#737373',
        }}
      >
        {subTitle}
      </span>
    </Stack>
  );
}

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '28px',
  color: '#737373',
  fontStyle: 'italic',
  padding: '8px 45px 8px 16px',
  backgroundColor: theme.palette.background.secondary,
}));

// disabled accordion sx
const disabledSx = {
  pointerEvents: 'none',
  opacity: '.6',
};

const itemSelectOptions = [
  { label: 'Selected Items', value: 'single' },
  { label: 'Entire Menu', value: 'multiple' },
];

const durationInit = {
  start: moment().format('YYYY-MM-DD'),
  end: moment().endOf('month').format('YYYY-MM-DD'),
};

const confirmActionInit = {
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
};

export default function MarketingSettings({
  onClose,
  // onActivate,
  // onDeactivate,
  onDelete,
  marketingType,
  shop,
  creatorType,
}) {
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
  const [pageMode, setPageMode] = useState(0);
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
    ['deal-settings'],
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

  const [itemSelectType, setItemSelectType] = useState('single');
  const [hasChanged, setHasChanged] = useState(false);
  const [globalRewardBundle, setGlobalRewardBundle] = useState();
  const [hasGlobalChange, setHasGlobalChange] = useState(false);
  const [queryEnabled, setQueryEnabled] = useState(true);

  const [duration, setDuration] = useState(durationInit);
  const [spendLimit, setSpendLimit] = useState('');
  const [products, setProducts] = useState([]);
  const [spendLimitChecked, setSpendLimitChecked] = useState(false);

  const setLocalData = (data) => {
    setProducts(data?.products);
    setDuration(data?.duration);
    setSpendLimit(data?.spendLimit);
    setItemSelectType(data?.itemSelectionType);

    if (data?.spendLimit > 0) {
      setSpendLimitChecked(true);
    } else {
      setSpendLimitChecked(false);
    }
  };

  const loyaltySettingsQuery = useQuery(
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

  useEffect(() => {
    if (loyaltySettingsQuery?.data !== undefined) {
      if (loyaltySettingsQuery?.data?.isMarketing) {
        if (loyaltySettingsQuery?.data?.data?.marketing?.status === 'active') {
          setIsPageDisabled(true);
          setPageMode(1);
        } else {
          setPageMode(0);
          setIsPageDisabled(false);
        }

        setServerState(loyaltySettingsQuery?.data?.data?.marketing);
        const newData = deepClone(loyaltySettingsQuery?.data?.data?.marketing);
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
  }, [loyaltySettingsQuery?.data]);

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
        return {
          id: item?._id,
          discountPercentage: item?.discountPercentage,
          discountPrice: item?.price - (item?.price / 100) * item?.discountPercentage,
          discount: (item?.price / 100) * item?.discountPercentage,
        };
      }

      // double_menu
      return {
        id: item?._id,
      };
    });

    if (marketingType !== 'free_delivery' && products?.length === 0) {
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
          queryClient.invalidateQueries([`marketing-${marketingType}-settings`]);
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
                fontSize: '16px',
                lineHeight: '24px',
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
          <ProductSelect
            fullWidth
            blurOnSelect
            openOnFocus
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
            popupIcon={<KeyboardArrowDownIcon />}
            getOptionLabel={(option) => option?.name || 'Select Product'}
            getOptionDisabled={(option) => !!products?.find((item) => item?._id === option?._id)}
            loading={productsQuery.isLoading || productsQuery.isFetching}
            disableClearable
            disablePortal
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  background: theme.palette.background.secondary,
                  '& .MuiAutocomplete-listbox': {
                    padding: 0,
                  },

                  '& .MuiAutocomplete-option': {
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    lineHeight: '31px',
                    fontSize: '15px',
                    alignItems: 'center',
                    justifyContent: 'space-between!important',
                    flexDirection: 'row',
                    padding: '0px 45px 0px 16px',
                  },
                }}
              >
                {children}
              </Paper>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {params.InputProps.endAdornment}
                      {!params.inputProps.value && (
                        <IconButton
                          size="small"
                          // eslint-disable-next-line max-len
                          className="custom-clear-button MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium MuiAutocomplete-clearIndicator"
                          onClick={() => {
                            console.log('clicked');
                          }}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            )}
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
      showFor: ['reward'],
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
            items={rewardSettingsQuery.data?.data?.rewardSetting?.rewardBundle || []}
            placeholder="Select Percentage"
            disabled={!params.row?.price}
            getKey={(item) => item}
            getValue={(item) => item}
            getLabel={(item) => item}
            getDisplayValue={(value) => `${value}`}
            onChange={(e) => {
              params.row.rewardBundle = Number(e.target.value);
              setRender(!render);
              setHasChanged(true);
              setHasGlobalChange(true);
            }}
            value={params.row?.rewardBundle || ''}
          />
        );
      },
    },
    {
      id: 3,
      headerName: `Discount`,
      showFor: ['percentage'],
      sortable: false,
      field: 'discount',
      flex: 1,
      align: 'left',
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          return <></>;
        }

        return (
          <FilterSelect
            items={shopPercentageDeals}
            placeholder="Select Percentage"
            disabled={!params.row?.price}
            getKey={(item) => item}
            getValue={(item) => item}
            getLabel={(item) => item}
            getDisplayValue={(value) => `${value}`}
            onChange={(e) => {
              params.row.discountPercentage = Number(e.target.value);
              setRender(!render);
              setHasChanged(true);
              setHasGlobalChange(true);
            }}
            value={params?.row?.discountPercentage || ''}
          />
        );
      },
    },
    {
      id: 4,
      headerName: `Category`,
      showFor: ['reward'],
      sortable: false,
      field: 'rewardCategory',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
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
      showFor: ['reward'],
      sortable: false,
      field: 'calc',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          return <></>;
        }

        if (!(params?.row?.price && params?.row?.rewardBundle && rewardAmount !== undefined)) {
          return <>--</>;
        }

        return (
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Typography variant="body1" color={theme.palette.secondary.main}>
                {Math.round(((params?.row?.price / 100) * params?.row?.rewardBundle) / rewardAmount)} Pts + {currency}{' '}
                {Math.round(params?.row?.price - (params?.row?.price / 100) * params.row.rewardBundle)}
              </Typography>
              <Typography
                sx={{
                  color: '#A3A3A3',
                  fontWeight: 500,
                  textDecoration: 'line-through',
                }}
                variant="body1"
              >
                {currency} {params?.row?.price}
              </Typography>
            </Stack>
            {itemSelectType !== 'multiple' && (
              <CloseButton
                color="secondary"
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
    {
      id: 6,
      headerName: `Final Price`,
      showFor: ['percentage'],
      sortable: false,
      field: 'calc',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          return <></>;
        }

        if (!params?.row?.discountPercentage) {
          return <>--</>;
        }

        return (
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Typography variant="body1" color={theme.palette.text.primary}>
                {currency}{' '}
                {(params?.row?.price - (params?.row?.price / 100) * params?.row?.discountPercentage)?.toFixed(2)}{' '}
              </Typography>
              <Typography
                sx={{
                  color: '#A3A3A3',
                  fontWeight: 500,
                  textDecoration: 'line-through',
                }}
                variant="body1"
              >
                {currency} {params?.row?.price}
              </Typography>
            </Stack>
            {itemSelectType !== 'multiple' && (
              <CloseButton
                size="sm"
                color="secondary"
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
    {
      id: 7,
      headerName: `Final Price`,
      showFor: ['double_menu'],
      sortable: false,
      field: 'calc',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          return <></>;
        }

        if (!params?.row?.price) {
          return <>--</>;
        }

        return (
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Typography variant="body1" color={theme.palette.text.primary}>
                {currency} {params?.row?.price}
              </Typography>
              <Typography
                sx={{
                  color: '#A3A3A3',
                  fontWeight: 500,
                  textDecoration: 'line-through',
                }}
                variant="body1"
              >
                {currency} {params?.row?.price * 2}{' '}
              </Typography>
            </Stack>
            {itemSelectType !== 'multiple' && (
              <CloseButton
                size="sm"
                color="secondary"
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
        gridTemplateColumns: '1fr 305px',
        position: 'relative',
        height: '100%',
      }}
    >
      <CloseButton
        color="secondary"
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
      {loyaltySettingsQuery.isLoading && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            width: '100%',
            background: 'rgba(255, 255, 255, .6)',
            zIndex: '9999',
            borderRadius: '7px',
          }}
        ></Box>
      )}
      {/* left */}
      <Box
        sx={{
          padding: '36px',
          paddingTop: '0px',
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
            }}
            pt={9}
            pb={2}
          >
            <Typography variant="h4" pb={3}>
              {marketingType === 'reward' && 'Loyalty Program'}
              {marketingType === 'percentage' && 'Discounted Items'}
              {marketingType === 'double_menu' && 'Buy 1, Get 1 Free'}
              {marketingType === 'free_delivery' && '$0 Delivery fee'}
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary2}>
              {marketingType === 'reward' &&
                'Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on an item, giving them more incentive to order from your business.'}
              {marketingType === 'percentage' &&
                'Provide a percentage discount for specific menu items or categories, allowing customers to save money while ordering their favorite dishes.'}
              {marketingType === 'double_menu' &&
                "Offer a 'buy one, get one free' promotion for up to 10 items, giving customers a chance to try new items without extra cost"}
              {marketingType === 'free_delivery' &&
                'Cover the entire delivery fee charged to the customer as a way to encourage customers to order from your business, and drive sales.'}
            </Typography>
          </Box>
          {/* products */}
          {marketingType !== 'free_delivery' && (
            <StyledAccordion
              Title={<ItemsTitle />}
              isOpen={currentExpanedTab === 0}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 0 : -1);
              }}
              sx={isPageDisabled || productsQuery?.isLoading ? disabledSx : {}}
            >
              <Box position="relative">
                <StyledRadioGroup
                  color="secondary"
                  items={itemSelectOptions.filter((item) => entireMenu || item.value !== 'multiple')}
                  value={itemSelectType}
                  onChange={onProductSelectChange}
                />
                {itemSelectType === 'multiple' && marketingType === 'reward' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: '99',
                      bottom: '-6px',
                      left: '130px',
                    }}
                  >
                    <FilterSelect
                      items={rewardSettingsQuery.data?.data?.rewardSetting?.rewardBundle || []}
                      placeholder="0%"
                      getKey={(item) => item}
                      getValue={(item) => item}
                      getLabel={(item) => item}
                      getDisplayValue={(value) => `${value}`}
                      onChange={(e) => {
                        products.forEach((product) => {
                          product.rewardBundle = Number(e.target.value);
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
                {itemSelectType === 'multiple' && marketingType === 'percentage' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: '99',
                      bottom: '-6px',
                      left: '130px',
                    }}
                  >
                    <FilterSelect
                      items={shopPercentageDeals || []}
                      placeholder="Select Percentage"
                      // disabled={!params.row?.price}
                      getKey={(item) => item}
                      getValue={(item) => item}
                      getLabel={(item) => item}
                      getDisplayValue={(value) => `${value}`}
                      onChange={(e) => {
                        products.forEach((product) => {
                          product.discountPercentage = Number(e.target.value);
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
                    minHeight: '0px',
                    height: `${products?.length > 0 ? '500px' : '200px'}`,
                  }}
                >
                  <StyledTable2
                    columns={allColumns.filter((column) => column.showFor.includes(marketingType))}
                    sx={{
                      '& .MuiDataGrid-main': {
                        overflow: 'visible!important',
                      },

                      '& .MuiDataGrid-cell': {
                        position: 'relative',
                        overflow: 'visible!important',
                      },

                      '& .MuiDataGrid-virtualScroller': {
                        paddingBottom: itemSelectType === 'multiple' ? '45px' : '0px',
                        overflowX: 'scroll!important',
                      },
                    }}
                    rows={createGroupedDataRow(products || [])}
                    getRowId={(row) => row?._id}
                    components={{
                      NoRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                          No Products Added
                        </Stack>
                      ),
                    }}
                    rowHeight={64}
                    autoHeight={false}
                    getRowHeight={({ model }) => {
                      if (model.isCategoryHeader) {
                        return 42;
                      }
                      return 64;
                    }}
                  />
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
                    color="secondary"
                    sx={{
                      padding: '0!important',
                      '&:hover': {
                        background: 'transparent',
                      },
                    }}
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
            sx={isPageDisabled ? disabledSx : {}}
          >
            <Stack direction="row" alignItems="center" gap={5} pt={1}>
              <Stack gap={2.5}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '17px',
                  }}
                >
                  Start Date
                </Typography>
                <FilterDate
                  value={duration.start}
                  onChange={(e) => {
                    setDuration((prev) => ({ ...prev, start: e._d }));
                    setHasGlobalChange(true);
                  }}
                />
              </Stack>
              <Stack gap={2.5}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '17px',
                  }}
                >
                  End Date
                </Typography>
                <FilterDate
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
            sx={isPageDisabled ? disabledSx : {}}
          >
            <Stack direction="row" alignItems="center" gap={5} pt={1}>
              <FormControlLabel
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: theme.palette.text.primary,
                  },
                }}
                label="Set maximum weekly spending limit"
                control={
                  <Checkbox
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.text.primary,
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
                    color: theme.palette.text.primary,
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
        {!loyaltySettingsQuery.isLoading && (
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
                          color: theme.palette.text.primary,
                        },
                      }}
                      checked={termAndCondition}
                      onChange={(e) => {
                        setTermAndCondition(e.target.checked);
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: '500',
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#404040',
                        marginRight: '6px',
                      }}
                    >
                      I accept
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: '500',
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: theme.palette.secondary.main,
                      }}
                    >
                      Terms & Conditions
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={!termAndCondition || loyaltySettingsMutaion.isLoading}
                    onClick={() => {
                      updateLoyaltySettings();
                    }}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      '&.Mui-disabled': {
                        background: theme.palette.secondary.main,
                        opacity: 0.3,
                        color: '#fff',
                      },
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
                    color="primary"
                    disableRipple
                    onClick={() => {
                      setConfirmModal(true);
                      setConfirmAction({
                        message: 'Are you sure?. Your campaign will be deleted.',
                        onCancel: () => setConfirmModal(false),
                        onConfirm: () => {
                          loyaltySettingsDeleteMutation.mutate();
                          setConfirmModal(false);
                        },
                      });
                    }}
                    sx={{
                      padding: '0px',
                      background: 'transparent',

                      '&:hover': {
                        background: 'transparent',
                      },

                      '&.Mui-disabled': {
                        color: theme.palette.primary.main,
                        opacity: '0.3',
                      },
                    }}
                  >
                    Delete Promotion
                  </Button>
                </Box>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    disabled={loyaltySettingsDeleteMutation.isLoading}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',

                      '&.Mui-disabled': {
                        borderColor: theme.palette.secondary.main,
                        opacity: 0.3,
                        color: theme.palette.secondary.main,
                      },
                    }}
                    onClick={() => {
                      setIsPageDisabled(false);
                      setPageMode(2);
                    }}
                  >
                    Edit Promotion
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={loyaltySettingsDeleteMutation.isLoading || loyaltySettingsMutaion.isLoading}
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
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      '&.Mui-disabled': {
                        background: theme.palette.primary.main,
                        opacity: 0.3,
                        color: '#fff',
                      },
                    }}
                  >
                    Deactivate Promotion
                  </Button>
                </Stack>
              </Stack>
            )}
            {pageMode === 2 && (
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',

                    '&.Mui-disabled': {
                      borderColor: theme.palette.secondary.main,
                      opacity: 0.3,
                      color: theme.palette.secondary.main,
                    },
                  }}
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
                  color="secondary"
                  onClick={() => {
                    updateLoyaltySettings();
                  }}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    '&.Mui-disabled': {
                      background: theme.palette.primary.secondary,
                      opacity: 0.3,
                      color: '#fff',
                    },
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
          padding: '36px',
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
