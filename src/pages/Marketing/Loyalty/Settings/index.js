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
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

// project import
import moment from 'moment';
import CloseButton from '../../../../components/Common/CloseButton';
import ConfirmModal from '../../../../components/Common/ConfirmModal';
import ProductSelect from '../../../../components/Common/ProductSelect';
import FilterDate from '../../../../components/Filter/FilterDate';
import FilterSelect from '../../../../components/Filter/FilterSelect';
import StyledAccordion from '../../../../components/Styled/StyledAccordion';
import StyledInput from '../../../../components/Styled/StyledInput';
import StyledRadioGroup from '../../../../components/Styled/StyledRadioGroup';
import StyledTable2 from '../../../../components/Styled/StyledTable2';
import getCookiesAsObject from '../../../../helpers/cookies/getCookiesAsObject';
import { deepClone } from '../../../../helpers/deepClone';
import { successMsg } from '../../../../helpers/successMsg';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import BannerPreview from './BannerPreview';

// helper functions
const createGroupedList = (products, category) => {
  const productsList = Object.values(_.groupBy(products || [], (product) => product?.category?.name)).flat();
  return productsList.filter((item) => !category || item?.category?.name === category);
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
        color={theme.palette.text.heading}
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
        color={theme.palette.text.heading}
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
  { label: 'Selected Items', value: 'multiple' },
  { label: 'Entire Menu', value: 'all' },
];

const durationInit = {
  start: moment().startOf('month').format('YYYY-MM-DD'),
  end: moment().endOf('month').format('YYYY-MM-DD'),
};

const confirmActionInit = {
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
};

// QUERY ONLY ONCE
let QUERY_RUNNED = false;

// access token
let accountId = null;

if (document.cookie.length) {
  const { account_id } = getCookiesAsObject();
  accountId = account_id || null;
}

const productSelectKeyForLS = 'loyaltySettingsSelectType';

export default function LoyaltySettings({ closeModal }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const { shopBanner, shopLogo, shopName } = useSelector((store) => store.Login.admin);
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

  // reward settings
  const rewardSettingsQuery = useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
    enabled: !QUERY_RUNNED,
    onSuccess: () => {
      QUERY_RUNNED = true;
    },
  });

  const rewardAmount = rewardSettingsQuery?.data?.data?.rewardSetting?.redeemReward?.amount || 1;

  // shop products
  const productsQuery = useQuery(
    ['products-query'],
    () =>
      AXIOS.get(Api.ALL_PRODUCT, {
        params: {
          page: 1,
          pageSize: 100,
          type: 'all',
          status: 'all',
          shop: accountId,
        },
      }),
    {
      staleTime: 1000 * 60 * 10,
    }
  );

  // loyalty settings
  const [itemSelectType, setItemSelectType] = useState(localStorage.getItem(productSelectKeyForLS) || 'multiple');
  const [hasChanged, setHasChanged] = useState(false);
  const [globalRewardBundle, setGlobalRewardBundle] = useState();
  const [hasGlobalChange, setHasGlobalChange] = useState(false);
  const [loyalityQueryEnabled, setLoyalityQueryEnabled] = useState(true);

  const [duration, setDuration] = useState(durationInit);
  const [spendLimit, setSpendLimit] = useState('');
  const [products, setProducts] = useState([]);
  const [spendLimitChecked, setSpendLimitChecked] = useState(false);

  const setLocalData = (data) => {
    setProducts(data?.products);
    setDuration(data?.duration);
    setSpendLimit(data?.spendLimit);

    if (data?.spendLimit > 0) {
      setSpendLimitChecked(true);
    } else {
      setSpendLimitChecked(false);
    }
  };

  const loyaltySettingsQuery = useQuery(['loyalty-settings'], () => AXIOS.get(Api.GET_LOYALTY_SETTINGS), {
    staleTime: 0,
    cacheTime: 0,
    enabled: loyalityQueryEnabled,
    onSuccess: (data) => {
      setLoyalityQueryEnabled(false);

      if (data?.isLoyaltyProgram) {
        if (data?.data?.loyaltyProgram?.isActive) {
          setIsPageDisabled(true);
          setPageMode(1);
        } else {
          setPageMode(0);
          setIsPageDisabled(false);
        }

        setServerState(data?.data?.loyaltyProgram);
        const newData = deepClone(data?.data?.loyaltyProgram);
        setLocalData(newData);

        if (newData?.products?.length > 0) {
          setHasChanged(true);
        }
      } else {
        setPageMode(0);
        setIsPageDisabled(false);
        setItemSelectType('multiple');
        localStorage.setItem(productSelectKeyForLS, 'multiple');
      }
    },
  });

  const onProductSelectChange = (event) => {
    if (hasChanged && products?.length > 0) {
      // open confirm modal
      setConfirmModal(true);

      // onconfirm
      const confirmFunc = (value) => {
        if (value === 'multiple') {
          setProducts([]);
        } else {
          setGlobalRewardBundle('');
          setProducts(deepClone(productsQuery?.data?.data?.products || []));
        }

        setConfirmModal(false);
        localStorage.setItem(productSelectKeyForLS, value);

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
      if (event.target.value === 'all') {
        setProducts(deepClone(productsQuery?.data?.data?.products || []));
      } else {
        setProducts([]);
      }

      setItemSelectType(event.target.value);
      setHasGlobalChange(true);
      setHasChanged(false);
      localStorage.setItem(productSelectKeyForLS, event.target.value);
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
  const loyaltySettingsMutaion = useMutation((data) => AXIOS.post(Api.UPDATE_LOYALTY_SETTINGS, data), {
    onSuccess: (data, args) => {
      if (data?.status) {
        setServerState((prev) => data?.data?.loyaltyProgram || prev);
        successMsg('Settings successfully updated', 'success');

        if (data?.data?.loyaltyProgram?.products?.length > 0) {
          setHasChanged(true);
        }

        setHasGlobalChange(false);

        queryClient.invalidateQueries(['loyalty-settings']);
        queryClient.invalidateQueries(['loyalty']);

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

    const productsData = products.map((item) => {
      if (!item?._id) {
        prb = 'Please remove empty items from list!';
      }

      if (!item?.rewardCategory) {
        prb = 'Please select category for product!';
      }

      if (!item?.rewardBundle) {
        prb = 'Please select reward bundle for product!';
      }

      return {
        id: item?._id,
        rewardCategory: item?.rewardCategory,
        rewardBundle: item?.rewardBundle,
        reward: {
          amount: Math.round(item.price - (item?.price / 100) * item?.rewardBundle),
          points: Math.round(((item?.price / 100) * item?.rewardBundle) / rewardAmount),
        },
      };
    });

    if (products?.length === 0) {
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
      successMsg('Spend limit cannot be empty', 'warn');
      return;
    }

    loyaltySettingsMutaion.mutate({
      products: productsData,
      shop: accountId,
      duration,
      spendLimit: spendLimitChecked ? spendLimit : 0,
      status: status || 'active',
    });
  };

  // delete settings
  // eslint-disable-next-line no-unused-vars
  const resetPage = () => {
    setIsPageDisabled(false);
    setPageMode(0);
    setTermAndCondition(false);
    setHasChanged(false);
    setHasGlobalChange(false);
    setProducts([]);
    setDuration(durationInit);
    setSpendLimit('');
    setSpendLimitChecked(false);
    localStorage.setItem(productSelectKeyForLS, 'multiple');
    setItemSelectType('multiple');
  };

  const loyaltySettingsDeleteMutation = useMutation(
    () =>
      AXIOS.post(Api.DELETE_LOYALTY_SETTINGS, {
        id: serverState?._id,
      }),
    {
      onSuccess: (data) => {
        successMsg(data?.message, 'success');

        if (data?.status) {
          queryClient.invalidateQueries(['loyalty']);
          localStorage.setItem(productSelectKeyForLS, 'multiple');
          closeModal();
        }
      },
    }
  );

  const columns = [
    {
      id: 1,
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
            disabled={productsQuery.isLoading}
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
            readOnly={undefined}
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  background: theme.palette.background.secondary,
                  '& .MuiAutocomplete-listbox': {
                    padding: 0,
                  },

                  '& .MuiAutocomplete-option': {
                    color: theme.palette.text.heading,
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
      headerName: `Category`,
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
      id: 4,
      headerName: `Final Price`,
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
            <CloseButton
              color="secondary"
              onClick={() => {
                removeProduct(params.row);
                setHasChanged(true);
              }}
            />
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
              onConfirm: () => closeModal(),
            });
          } else {
            closeModal();
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
              Loyalty Program
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary2}>
              Enable this feature and allow customers to use their points to pay for a portion or all of their purchase
              on an item, giving them more incentive to order from your business.
            </Typography>
          </Box>
          {/* products */}
          <StyledAccordion
            Title={<ItemsTitle />}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
            sx={isPageDisabled ? disabledSx : {}}
          >
            <Box position="relative">
              <StyledRadioGroup
                color="secondary"
                items={itemSelectOptions}
                value={itemSelectType}
                onChange={onProductSelectChange}
              />
              {itemSelectType === 'all' && (
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
            </Box>
            <Box pt={5}>
              <Box
                sx={{
                  minHeight: '0px',
                  height: `${products.length > 0 ? '500px' : '200px'}`,
                }}
              >
                <StyledTable2
                  columns={columns}
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
                  rows={createGroupedDataRow(products)}
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
                    : 'March 1, 2023 - April 1, 2023'
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
                    color: theme.palette.text.heading,
                  },
                }}
                label="Set maximum weekly spending limit"
                control={
                  <Checkbox
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.text.heading,
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
                    color: theme.palette.text.heading,
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
                        color: theme.palette.text.heading,
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
                      loyaltySettingsDeleteMutation.mutate();
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
                      updateLoyaltySettings('inactive');
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
        <BannerPreview banner={shopBanner} logo={shopLogo} name={shopName} />
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
