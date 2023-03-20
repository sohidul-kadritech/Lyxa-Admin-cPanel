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
  Autocomplete,
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
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

// project import
import moment from 'moment';
import FilterDate from '../../../components/Filter/FilterDate';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledAccordion from '../../../components/Styled/StyledAccordion';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import StyledTable2 from '../../../components/Styled/StyledTable2';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { data } from './mockData';

const rewardBundles = [
  {
    label: 25,
    value: 25,
  },
  {
    label: 40,
    value: 40,
  },
  {
    label: 50,
    value: 50,
  },
  {
    label: 100,
    value: 100,
  },
];

const rewardCategories = [
  {
    label: 'Mood Booster',
    value: 'Mood Booster',
  },
  {
    label: 'Late Night',
    value: 'Late Night',
  },
  {
    label: 'Couple Dinner',
    value: 'Couple Dinner',
  },
];

const itemSelectOptions = [
  { label: 'Selected Items', value: 'multiple' },
  { label: 'Entire Menu', value: 'all' },
];

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

const StyledAutoComplete = styled(Autocomplete)(({ theme }) => ({
  /* normal styles */

  '& .MuiAutocomplete-listbox': {
    maxHeight: '300px',
    background: theme.palette.background.secondary,
  },

  '& .MuiInputBase-root': {
    background: theme.palette.background.secondary,
    borderRadius: '40px',
    padding: '12px 40px 12px 8px !important',

    '& .MuiInputAdornment-positionStart': {
      width: '0px',
      height: '0px',
      visibility: 'hidden',
      opacity: '0',
    },

    '& .MuiAutocomplete-clearIndicator': {
      color: theme.palette.secondary.main,
    },
  },

  '& .MuiInputBase-input': {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '500',
    color: theme.palette.text.heading,
    padding: '0!important',
  },

  '& .MuiAutocomplete-popupIndicator:hover': {
    background: 'transparent',
  },

  '& .MuiAutocomplete-clearIndicator:hover': {
    background: 'none',
  },

  '& fieldset': {
    border: 'none',
  },

  '& .custom-clear-button': {
    visibility: 'hidden',
    opacity: '0',
    pointerEvents: 'none',

    '& .MuiSvgIcon-root': {
      width: '19px',
      height: '19px',
    },
  },

  /* focus styles */
  '&:has(.MuiInputBase-input:focus)': {
    borderRadius: '25px',
    width: '475px',
    position: 'absolute',
    zIndex: '99',
    top: '8px',
  },

  '& .MuiInputBase-root:has(.MuiInputBase-input:focus)': {
    padding: '13px 16px!important',
    paddingRight: '70px!important',
    position: 'relative',
    borderRadius: '40px 40px 0 0',

    '& .MuiInputAdornment-positionStart': {
      visibility: 'visible',
      opacity: '1',
      margin: '0',
      height: 'auto',
      width: 'auto',
      position: 'absolute',
      left: '26px',
      top: '22px',
    },

    '& .MuiAutocomplete-popupIndicator': {
      display: 'none!important',
    },

    '& .MuiAutocomplete-clearIndicator': {
      position: 'absolute',
      right: '15px',
      top: '0px',
      color: theme.palette.secondary.main,
      visibility: 'visible!important',
      pointerEvents: 'all',
    },

    '& .custom-clear-button': {
      visibility: 'visible',
      opacity: '1',
      pointerEvents: 'all',
      top: '18.5px',
      right: '24.5px',
    },
  },

  '& .MuiInputBase-input:focus': {
    background: '#fff',
    height: '40px',
    borderRadius: '40px',
    paddingLeft: '42px!important',
  },
}));

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
      categoryMap[item?.category.name] = [item];
    } else {
      categoryMap[item?.category.name].push(item);
    }
  });

  Object.entries(categoryMap).forEach((category, index) => {
    result.push({ _id: `c-${index}`, isCategoryHeader: true, categoryName: category[0] });
    result.push(...category[1]);
  });

  return result;
};

// QUERY ONLY ONCE
let QUERY_RUNNED = false;

// project import
export default function LoyaltySettings() {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const theme = useTheme();

  const [currentExpanedTab, seCurrentExpanedTab] = useState(0);
  const [itemSelectType, setItemSelectType] = useState('multiple');
  const [productsData, setProductsData] = useState(data);
  const [render, setRender] = useState(false);

  // accept terms and conditions
  const [termAndCondition, setTermAndCondition] = useState(false);

  // filter
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));

  const productsQuery = useQuery(
    ['products-query'],
    () =>
      AXIOS.get(Api.ALL_PRODUCT, {
        params: {
          page: 1,
          pageSize: 50,
          type: 'all',
          status: 'all',
          shop: '6406e183c65e42a0fe26891d',
        },
      }),
    {
      staleTime: 1000 * 60 * 10,
    }
  );

  const rewardSettingsQuery = useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
    enabled: !QUERY_RUNNED,
    onSuccess: (data) => {
      QUERY_RUNNED = false;
    },
  });

  const rewardAmount = rewardSettingsQuery?.data?.data?.rewardSetting?.redeemReward?.amount || 1;

  console.log(rewardSettingsQuery.data);

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
          <StyledAutoComplete
            fullWidth
            blurOnSelect
            openOnFocus
            value={params.row}
            options={createGroupedList(productsQuery?.data?.data?.products || [])}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            onChange={(event, newValue) => {
              params.row.product = newValue;
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
      headerAlign: 'left',
      renderCell: (params) => {
        if (params?.row?.isCategoryHeader) {
          return <></>;
        }

        return (
          <FilterSelect
            items={rewardBundles}
            onChange={(e) => {
              params.row.rewardBundle = Number(e.target.value);
              setRender(!render);
            }}
            value={params.row?.rewardBundle}
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
            items={rewardCategories}
            value={params.row?.rewardCategory?.name}
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

        return (
          <Stack
            direction="row"
            alignItem="center"
            gap={1.5}
            color={theme.palette.secondary.main}
            sx={{
              fontWeight: 500,
            }}
          >
            <Typography variant="body1">
              {Math.round((params?.row?.product?.price / 100) * params.row.rewardBundle) * rewardAmount} Pts +{' '}
              {currency}{' '}
              {Math.round(params?.row?.product?.price - (params?.row?.product?.price / 100) * params.row.rewardBundle)}
            </Typography>
            <Typography
              sx={{
                color: '#A3A3A3',
                fontWeight: 500,
                textDecoration: 'line-through',
              }}
              variant="body1"
            >
              {currency} {params?.row?.product?.price}
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
      }}
    >
      {/* left */}
      <Box
        sx={{
          padding: '36px',
          borderRight: `1px solid ${theme.palette.custom.border}`,
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
        >
          <StyledRadioGroup
            color="secondary"
            items={itemSelectOptions}
            value={itemSelectType}
            onChange={(e) => {
              setItemSelectType(e.target.value);
            }}
          />
          <Box pt={5}>
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
              }}
              rows={createGroupedDataRow(data)}
              getRowId={(row) => row?._id}
              rowHeight={64}
              getRowHeight={({ model }) => {
                if (model.isCategoryHeader) {
                  return 42;
                }
                return 64;
              }}
            />
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
                value={startDate}
                onChange={(e) => {
                  setStartDate(e._d);
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
                value={endDate}
                onChange={(e) => {
                  setEndDate(e._d);
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
