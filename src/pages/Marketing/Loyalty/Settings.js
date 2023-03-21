/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
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
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';

// project import
import moment from 'moment';
import ProductSelect from '../../../components/Common/ProductSelect';
import FilterDate from '../../../components/Filter/FilterDate';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledAccordion from '../../../components/Styled/StyledAccordion';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import StyledTable2 from '../../../components/Styled/StyledTable2';
import getCookiesAsObject from '../../../helpers/cookies/getCookiesAsObject';
import setCookiesAsObj from '../../../helpers/cookies/setCookiesAsObject';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

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

const GroupItems = styled('ul')({
  padding: 0,
});

const createGroupedList = (products) =>
  Object.values(_.groupBy(products || [], (product) => product?.category?.name)).flat();

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

// access token
let accountId = null;
let acceptedLoyaltyProgram = false;

if (document.cookie.length) {
  const { account_id, loyaltyProgramAccepted } = getCookiesAsObject();
  accountId = account_id || null;
  acceptedLoyaltyProgram = Boolean(loyaltyProgramAccepted);
}

// QUERY ONLY ONCE
let QUERY_RUNNED = false;

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

// project import
export default function LoyaltySettings() {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const theme = useTheme();

  // accept terms and conditions
  const [termAndCondition, setTermAndCondition] = useState(false);

  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const [itemSelectType, setItemSelectType] = useState('multiple');
  const [isPageDisabled, setIsPageDisabled] = useState(true);
  const [render, setRender] = useState(false);

  // filter
  const [duration, setDuration] = useState(durationInit);
  const [spendLimit, setSpendLimit] = useState('');

  // products
  const [products, setProducts] = useState([]);

  // get all products
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

  // get reward settings
  const rewardSettingsQuery = useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
    enabled: !QUERY_RUNNED,
    onSuccess: (data) => {
      QUERY_RUNNED = false;
    },
  });

  const rewardAmount = rewardSettingsQuery?.data?.data?.rewardSetting?.redeemReward?.amount || 1;

  // get loyalty settings

  const updateLocalData = (data) => {
    if (!data?.isLoyaltyProgram) {
      setIsPageDisabled(true);
      return;
    }

    let newData = {};
    try {
      console.log(data);
      newData = JSON.parse(JSON.stringify(data?.data?.loyaltyProgram));
      setProducts(newData?.products);
      setDuration(newData?.duration);
      setSpendLimit(newData?.spendLimit);
    } catch (error) {
      console.log(error);
    }
  };

  const loyaltySettingsQuery = useQuery(['loyalty-settings'], () => AXIOS.get(Api.GET_LOYALTY_SETTINGS), {
    staleTime: 1000 * 60 * 10,
    onSuccess: (data) => {
      // console.log(data);
      updateLocalData(data);
    },
  });

  // update loyalty settings
  const loyaltySettingsMutaion = useMutation((data) => AXIOS.post(Api.UPDATE_LOYALTY_SETTINGS, data));

  const updateLoyaltySettings = () => {
    const productsData = products.map((item) => ({
      id: item?._id,
      rewardCategory: item?.rewardCategory,
      rewardBundle: item?.rewardBundle,
      reward: {
        amount: Math.round(item.price - (item?.price / 100) * item?.rewardBundle),
        points: Math.round((item?.price / 100) * item?.rewardBundle) * rewardAmount,
      },
    }));

    loyaltySettingsMutaion.mutate({
      products: productsData,
      shop: accountId,
      duration,
      spendLimit,
    });
  };

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
              {console.log(params?.row?.categoryName)}
            </Typography>
          );
        }

        return (
          <ProductSelect
            fullWidth
            blurOnSelect
            openOnFocus
            value={params.row}
            options={createGroupedList(productsQuery?.data?.data?.products || []).filter((item) => {
              const productFound = products.find((product) => product?._id === item?._id);
              return !productFound;
            })}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            onChange={(event, newValue) => {
              params.row = newValue;
              setRender(!render);
            }}
            popupIcon={<KeyboardArrowDownIcon />}
            getOptionLabel={(option) => option?.name || 'Select Product'}
            loading={productsQuery.isLoading || productsQuery.isFetching}
            readOnly={undefined}
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  background: theme.palette.background.secondary,
                  '& .MuiAutocomplete-listbox': {
                    padding: 0,
                  },

                  '& .MuiAutocomplete-option': {
                    padding: '0px',
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
                <GroupItems>{params.children}</GroupItems>
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
            getKey={(item) => item}
            getValue={(item) => item}
            getLabel={(item) => item}
            getDisplayValue={(value) => `${value}`}
            onChange={(e) => {
              params.row.rewardBundle = Number(e.target.value);
              setRender(!render);
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
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            color={theme.palette.secondary.main}
            sx={{
              fontWeight: 500,
            }}
          >
            <Typography variant="body1">
              {Math.round((params?.row?.price / 100) * params?.row?.rewardBundle) * rewardAmount} Pts + {currency}{' '}
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
      {/* overlay */}
      {Boolean(loyaltySettingsQuery.isLoading) && (
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
          borderRight: `1px solid ${theme.palette.custom.border}`,
          minHeight: '0',
          maxHeight: '100%',
          overflowY: 'scroll',
        }}
      >
        <Typography variant="h4" pb={3}>
          Loyalty Program
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary2}>
          Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on
          an item, giving them more incentive to order from your business.
        </Typography>
        {/* products */}
        <StyledAccordion
          Title={<ItemsTitle />}
          isOpen={currentExpanedTab === 0}
          onChange={(closed) => {
            seCurrentExpanedTab(closed ? 0 : -1);
          }}
          sx={isPageDisabled ? disabledSx : {}}
        >
          <StyledRadioGroup
            color="secondary"
            items={itemSelectOptions}
            value={itemSelectType}
            onChange={(e) => {
              if (e.target.value === 'all') {
                setProducts([...(productsQuery?.data?.data?.products?.slice(0, 9) || [])]);
              }
              setItemSelectType(e.target.value);
            }}
          />
          <Box pt={5} position="relative" height="250px">
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
            {/* add new */}
            {itemSelectType === 'multiple' && products.length < 10 && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  position: 'absolute',
                  bottom: '15px',
                  left: 0,
                  right: 0,
                  widht: '100%',
                }}
              >
                {}
                <Button
                  disableRipple
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
                  {1}/{10} items
                </Typography>
              </Stack>
            )}
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
                  checked
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
              placeholder="Max amount"
              value={spendLimit}
              onChange={(event) => {
                setSpendLimit(event.target.value);
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                endAdornment: <InputAdornment position="end">/week</InputAdornment>,
              }}
            />
          </Stack>
        </StyledAccordion>
        <Box
          sx={{
            height: '160px',
          }}
        ></Box>
        {/* promotion isn't set up */}
        {!loyaltySettingsQuery.data?.isLoyaltyProgram && !loyaltySettingsQuery.isLoading && !acceptedLoyaltyProgram && (
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
              disabled={!termAndCondition}
              onClick={() => {
                setCookiesAsObj(
                  {
                    loyaltyProgramAccepted: true,
                  },
                  7
                );
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
        {isPageDisabled && (
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
                  color: '#fff',
                },
              }}
              onClick={() => {
                setIsPageDisabled(false);
              }}
            >
              Edit Promotion
            </Button>
            <Button
              variant="contained"
              color="primary"
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
        )}
        {!isPageDisabled && (
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
                  color: '#fff',
                },
              }}
            >
              Discard Changes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                // setIsPageDisabled(true);
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
      {/* right */}
      <Box
        sx={{
          padding: '36px',
        }}
      >
        Fist Side
      </Box>
    </Box>
  );
}
