/* eslint-disable no-unused-vars */
// third party, Typography
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { Add, West } from '@mui/icons-material';
import { Box, Button, Stack, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

// project import
import PageButton from '../../components/Common/PageButton';
import StyledChip from '../../components/Styled/StyledChips';
import StyledInput from '../../components/Styled/StyledInput';
import StyledSwitchList from '../../components/Styled/StyledSwitchList';
import Wrapper from '../../components/Wrapper';
import { deepClone } from '../../helpers/deepClone';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

const dealTypes = [
  {
    value: 'double_menu',
    label: 'Double Menu',
  },

  {
    value: 'free_delivery',
    label: 'Free Delivery',
  },

  {
    value: 'percentage',
    label: 'Percentage',
  },
];

// QUERY ONLY ONCE
let QUERY_RUNNED = false;

export default function DealSettings() {
  const theme = useTheme();
  const [serverState, setServerState] = useState({});
  const [newBundleItem, setNewBundleItem] = useState('');

  // restaurant
  const [restaurantBundles, setRestaurantBundles] = useState([]);
  const [showRestaurantAdd, setShowRestaurantAdd] = useState(false);
  const [restaurantDeals, setRestaurantDeals] = useState([]);
  const restaurantAddBundleRef = useRef();

  // grocery
  const [groceryBundles, setGroceryBundles] = useState([]);
  const [showGroceryAdd, setShowGroceryAdd] = useState(false);
  const [groceryDeals, setGroceryDeals] = useState([]);
  const groceryAddBundleRef = useRef();

  // pharmacy
  const [pharmacyBundles, setPharmacyBundles] = useState([]);
  const [showPharmacyAdd, setShowPharmacyAdd] = useState(false);
  const [pharmacyDeals, setPharmacyDeals] = useState([]);
  const pharmacyAddBundleRef = useRef();

  const addNewBundleItem = (type) => {
    if (Number(newBundleItem) < 1) {
      successMsg('Reward Bundle cannot be smaller than 1');
      return;
    }

    if (Number(newBundleItem) > 100) {
      successMsg('Reward Bundle cannot be greater than 100');
      return;
    }

    if (Number.isNaN(Number(newBundleItem))) {
      successMsg('Please enter a valid value');
      return;
    }

    let oldList;
    let setOldList;
    let setShowAdd;

    if (type === 'pharmacy') {
      oldList = pharmacyBundles;
      setOldList = setPharmacyBundles;
      setShowAdd = setShowPharmacyAdd;
    } else if (type === 'grocery') {
      oldList = groceryBundles;
      setOldList = setGroceryBundles;
      setShowAdd = setShowGroceryAdd;
    } else {
      oldList = restaurantBundles;
      setOldList = setRestaurantBundles;
      setShowAdd = setShowRestaurantAdd;
    }

    if (oldList.includes(Number(newBundleItem))) {
      successMsg('Reward Bundle item already exists');
      return;
    }

    setOldList((prev) => [...prev, Number(newBundleItem)]);
    setNewBundleItem('');
    setShowAdd(false);
  };

  const deleteItem = (type, payload) => {
    switch (type) {
      case 'restaurant':
        setRestaurantBundles((prev) => prev.filter((item, index) => index !== payload));
        break;

      case 'grocery':
        setGroceryBundles((prev) => prev.filter((item, index) => index !== payload));
        break;

      case 'pharmacy':
        setPharmacyBundles((prev) => prev.filter((item, index) => index !== payload));
        break;
      default:
    }
  };

  const updateLocalState = (data) => {
    data?.forEach((item) => {
      if (item?.type === 'pharmacy') {
        setPharmacyBundles(item?.percentageBundle || []);
        setPharmacyDeals(item?.option || []);
      } else if (item?.type === 'grocery') {
        setGroceryBundles(item?.percentageBundle || []);
        setGroceryDeals(item?.option || []);
      } else {
        setRestaurantBundles(item?.percentageBundle || []);
        setRestaurantDeals(item?.option || []);
      }
    });
  };

  useQuery(
    ['deal-settings'],
    () =>
      AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS, {
        params: {
          type: 'all',
        },
      }),
    {
      enabled: !QUERY_RUNNED,
      onSuccess: (data) => {
        QUERY_RUNNED = true;
        console.log('backend data', data);

        if (data?.status) {
          setServerState(data?.data?.dealSetting);

          const newData = deepClone(data?.data?.dealSetting);
          updateLocalState(newData || []);
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
      },
    }
  );

  const updateSettingsMutation = useMutation((data) => AXIOS.post(Api.EDIT_ADMIN_DEAL_SETTINGS, data), {
    onSuccess: (data) => {
      successMsg(data?.message, 'success');

      if (data?.status) {
        const newData = deepClone(data?.data?.dealSetting);
        updateLocalState(newData || []);
        setServerState(data?.data?.dealSetting);
      }
    },
    onError: (error) => {
      console.log('api error: ', error);
    },
  });

  const updateSettings = () => {
    updateSettingsMutation.mutate({
      deals: [
        {
          percentageBundle: pharmacyBundles,
          type: 'pharmacy',
          option: pharmacyDeals,
        },
        {
          percentageBundle: groceryBundles,
          type: 'grocery',
          option: groceryDeals,
        },
        {
          percentageBundle: restaurantBundles,
          type: 'restaurant',
          option: restaurantDeals,
        },
      ],
      type: ['pharmacy', 'grocery', 'restaurant'],
    });
  };

  const discardChanges = () => {
    updateLocalState(deepClone(serverState) || []);
  };

  return (
    <Wrapper>
      <Box
        className="page-content"
        sx={{ height: '100vh', paddingLeft: '0px', paddingRight: '0px', overflowY: 'scroll' }}
      >
        {/* top */}
        <Box
          sx={{
            pb: 5,
          }}
        >
          <PageButton label="Back to Marketing" startIcon={<West />} />
          <Typography
            variant="h4"
            color={theme.palette.text.heading}
            sx={{
              pt: 5,
              pb: 2,
            }}
          >
            Loyalty Points
          </Typography>
        </Box>
        <Grid container spacing="25px">
          {/* restaurant */}
          <Grid xs={12}>
            <Box
              sx={{
                padding: '25px 30px 20px 30px',
                background: '#fff',
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                pb={4}
                sx={{
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '20px',
                }}
              >
                Food
              </Typography>
              {/* bundles */}
              <Box pb={6}>
                <Typography variant="h6" pb={4}>
                  Percentage Bundle
                </Typography>
                <Stack direction="row" gap={4} mb={2.5}>
                  {restaurantBundles.map((item, index) => (
                    <StyledChip
                      key={item}
                      label={item}
                      onDelete={() => {
                        deleteItem('restaurant', index);
                      }}
                    />
                  ))}
                  {showRestaurantAdd && (
                    <ClickAwayListener
                      onClickAway={() => {
                        if (showRestaurantAdd) {
                          setShowRestaurantAdd(false);
                          setNewBundleItem('');
                        }
                      }}
                    >
                      <StyledInput
                        ref={restaurantAddBundleRef}
                        type="number"
                        value={newBundleItem}
                        sx={{
                          '& input': {
                            fontSize: '13px',
                            height: 'auto',
                          },
                        }}
                        onChange={(e) => {
                          setNewBundleItem(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addNewBundleItem();
                          }
                        }}
                      />
                    </ClickAwayListener>
                  )}
                </Stack>
                <Button
                  disableRipple
                  color="secondary"
                  variant="text"
                  startIcon={<Add />}
                  sx={{
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '17px',
                    padding: '0px',

                    '&:hover': {
                      background: 'transparent',
                    },
                  }}
                  onClick={() => {
                    setShowRestaurantAdd(true);
                    setTimeout(() => {
                      restaurantAddBundleRef?.current?.querySelector('input')?.focus();
                    }, 10);
                  }}
                >
                  Add bundle
                </Button>
              </Box>
              {/* options */}
              <StyledSwitchList
                items={dealTypes}
                values={restaurantDeals}
                onChange={(value) => {
                  if (restaurantDeals.includes(value)) {
                    setRestaurantDeals((prev) => prev.filter((item) => item !== value));
                  } else {
                    setRestaurantDeals((prev) => [...prev, value]);
                  }
                }}
              />
            </Box>
          </Grid>
          {/* grocery */}
          <Grid xs={12}>
            <Box
              sx={{
                padding: '25px 30px 20px 30px',
                background: '#fff',
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                pb={4}
                sx={{
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '20px',
                }}
              >
                Grocery
              </Typography>
              {/* bundles */}
              <Box pb={6}>
                <Typography variant="h6" pb={4}>
                  Percentage Bundle
                </Typography>
                <Stack direction="row" gap={4} mb={2.5}>
                  {groceryBundles.map((item, index) => (
                    <StyledChip
                      key={item}
                      label={item}
                      onDelete={() => {
                        deleteItem('grocery', index);
                      }}
                    />
                  ))}
                  {showGroceryAdd && (
                    <ClickAwayListener
                      onClickAway={() => {
                        if (showGroceryAdd) {
                          setShowGroceryAdd(false);
                          setNewBundleItem('');
                        }
                      }}
                    >
                      <StyledInput
                        ref={groceryAddBundleRef}
                        type="number"
                        value={newBundleItem}
                        sx={{
                          '& input': {
                            fontSize: '13px',
                            height: 'auto',
                          },
                        }}
                        onChange={(e) => {
                          setNewBundleItem(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addNewBundleItem('grocery');
                          }
                        }}
                      />
                    </ClickAwayListener>
                  )}
                </Stack>
                <Button
                  disableRipple
                  color="secondary"
                  variant="text"
                  startIcon={<Add />}
                  sx={{
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '17px',
                    padding: '0px',

                    '&:hover': {
                      background: 'transparent',
                    },
                  }}
                  onClick={() => {
                    setShowGroceryAdd(true);
                    setTimeout(() => {
                      groceryAddBundleRef?.current?.querySelector('input')?.focus();
                    }, 10);
                  }}
                >
                  Add bundle
                </Button>
              </Box>
              {/* options */}
              <StyledSwitchList
                items={dealTypes}
                values={groceryDeals}
                onChange={(value) => {
                  if (groceryDeals.includes(value)) {
                    setGroceryDeals((prev) => prev.filter((item) => item !== value));
                  } else {
                    setGroceryDeals((prev) => [...prev, value]);
                  }
                }}
              />
            </Box>
          </Grid>
          {/* prarmacy */}
          <Grid xs={12}>
            <Box
              sx={{
                padding: '25px 30px 20px 30px',
                background: '#fff',
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                pb={4}
                sx={{
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '20px',
                }}
              >
                Pharmacy
              </Typography>
              {/* bundles */}
              <Box pb={6}>
                <Typography variant="h6" pb={4}>
                  Percentage Bundle
                </Typography>
                <Stack direction="row" gap={4} mb={2.5}>
                  {pharmacyBundles.map((item, index) => (
                    <StyledChip
                      key={item}
                      label={item}
                      onDelete={() => {
                        deleteItem('pharmacy', index);
                      }}
                    />
                  ))}
                  {showPharmacyAdd && (
                    <ClickAwayListener
                      onClickAway={() => {
                        if (showPharmacyAdd) {
                          setShowPharmacyAdd(false);
                          setNewBundleItem('');
                        }
                      }}
                    >
                      <StyledInput
                        ref={pharmacyAddBundleRef}
                        type="number"
                        value={newBundleItem}
                        sx={{
                          '& input': {
                            fontSize: '13px',
                            height: 'auto',
                          },
                        }}
                        onChange={(e) => {
                          setNewBundleItem(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addNewBundleItem('pharmacy');
                          }
                        }}
                      />
                    </ClickAwayListener>
                  )}
                </Stack>
                <Button
                  disableRipple
                  color="secondary"
                  variant="text"
                  startIcon={<Add />}
                  sx={{
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '17px',
                    padding: '0px',

                    '&:hover': {
                      background: 'transparent',
                    },
                  }}
                  onClick={() => {
                    setShowPharmacyAdd(true);
                    setTimeout(() => {
                      pharmacyAddBundleRef?.current?.querySelector('input')?.focus();
                    }, 10);
                  }}
                >
                  Add bundle
                </Button>
              </Box>
              {/* options */}
              <StyledSwitchList
                items={dealTypes}
                values={pharmacyDeals}
                onChange={(value) => {
                  if (pharmacyDeals.includes(value)) {
                    setPharmacyDeals((prev) => prev.filter((item) => item !== value));
                  } else {
                    setPharmacyDeals((prev) => [...prev, value]);
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
        {/* buttons */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          gap={4}
          sx={{
            mt: 9,
            pb: 12,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              discardChanges();
            }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={updateSettingsMutation.isLoading}
            onClick={() => {
              updateSettings();
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Wrapper>
  );
}
