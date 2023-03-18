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
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import _ from 'lodash';
import { useState } from 'react';
import { useQuery } from 'react-query';

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

  /* focus styles */
  '&:has(.MuiInputBase-input:focus)': {
    borderRadius: '25px',
    width: '430px',
    position: 'absolute',
    zIndex: '99',
    top: '0',
  },

  '& .MuiInputBase-root:has(.MuiInputBase-input:focus)': {
    padding: '13px 16px!important',
    paddingRight: '70px!important',
    position: 'relative',

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
  },

  '& .MuiInputBase-input:focus': {
    background: '#fff',
    height: '40px',
    borderRadius: '40px',
    paddingLeft: '42px!important',
  },
  '& .custom-clear-button': {
    display: '-webkit-inline-box',
    display: '-webkit-inline-flex',
    display: '-ms-inline-flexbox',
    display: 'inline-flex',
    WebkitAlignItems: 'center',
    WebkitBoxAlign: 'center',
    MsFlexAlign: 'center',
    alignItems: 'center',
    WebkitBoxPack: 'center',
    MsFlexPack: 'center',
    WebkitJustifyContent: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: 'transparent',
    outline: '0',
    border: '0',
    margin: '0',
    borderRadius: '0',
    padding: '0',
    cursor: 'pointer',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
    verticalAlign: 'middle',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    WebkitTextDecoration: 'none',
    textDecoration: 'none',
    color: 'inherit',
    textAlign: 'center',
    WebkitFlex: '0 0 auto',
    MsFlex: '0 0 auto',
    flex: '0 0 auto',
    fontSize: '1.5rem',
    padding: '8px',
    borderRadius: '50%',
    overflow: 'visible',
    color: 'rgba(0, 0, 0, 0.54)',
    WebkitTransition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    marginRight: '-2px',
    padding: '4px',
    visibility: 'hidden',
  },
}));

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.primary.light,
}));

const GroupItems = styled('ul')({
  padding: 0,
});

// project import
export default function LoyaltySettings() {
  const theme = useTheme();
  const [currentExpanedTab, seCurrentExpanedTab] = useState(0);
  const [itemSelectType, setItemSelectType] = useState('multiple');
  // eslint-disable-next-line no-unused-vars
  const [productsData, setProductsData] = useState(data);

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
      renderCell: () => (
        <StyledAutoComplete
          fullWidth
          options={createGroupedList(productsQuery?.data?.data?.products || [])}
          popupIcon={<KeyboardArrowDownIcon />}
          getOptionLabel={(option) => option?.name}
          loading={productsQuery.isLoading || productsQuery.isFetching}
          readOnly={undefined}
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
                        onClick={() => {}}
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
