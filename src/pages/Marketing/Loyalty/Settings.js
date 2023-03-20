/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
// third party
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
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
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledAccordion from '../../../components/Styled/StyledAccordion';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import StyledTable2 from '../../../components/Styled/StyledTable2';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const rewardBundles = [25, 30, 40, 50, 100];

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

const data = [
  {
    id: 1,
    product: {
      label: 'Vegan Burger',
      name: 'vegan-burger',
      price: 30,
    },
    rewardBundle: 50,
    rewardCategory: 'Mood Booster',
  },
  {
    id: 3,
    product: {
      label: 'Vegan Sandwitch',
      name: 'vegan-sandwitch',
      price: 70,
    },
    rewardBundle: 50,
    rewardCategory: 'Late Night',
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

// project import
export default function LoyaltySettings() {
  const theme = useTheme();
  const [currentExpanedTab, seCurrentExpanedTab] = useState(0);
  const [itemSelectType, setItemSelectType] = useState('multiple');
  const [productsData, setProductsData] = useState(data);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);

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

  const createGroupedList = (products) =>
    Object.values(_.groupBy(products || [], (product) => product?.category?.name)).flat();

  const columns = [
    {
      id: 1,
      headerName: `Item`,
      sortable: false,
      field: 'product',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <StyledAutoComplete
          fullWidth
          blurOnSelect
          openOnFocus
          options={createGroupedList(productsQuery?.data?.data?.products || [])}
          popupIcon={<KeyboardArrowDownIcon />}
          getOptionLabel={(option) => option?.name}
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
      ),
    },
    {
      id: 2,
      headerName: `Point Percentage`,
      sortable: false,
      field: 'rewardBundle',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => <FilterSelect plainList items={rewardBundles} value={params.row?.rewardBundle} />,
    },
    {
      id: 3,
      headerName: `Category`,
      sortable: false,
      field: 'rewardCategory',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => <FilterSelect items={rewardCategories} value={params.row?.rewardCategory} />,
    },
    {
      id: 4,
      headerName: `Final Price`,
      sortable: false,
      field: 'calc',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => <Typography variant="body1">{params?.row?.product?.price}</Typography>,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 305px',
        paddingBottom: '250px',
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
        {/* tabs */}
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
            <StyledTable2 columns={columns} rows={productsData} rowHeight={64} />
          </Box>
        </StyledAccordion>
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
