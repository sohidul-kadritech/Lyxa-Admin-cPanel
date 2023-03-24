/* eslint-disable no-unused-vars */
// third party, Typography
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { Add, West } from '@mui/icons-material';
import { Box, Button, Stack, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';

// project import
import PageButton from '../../components/Common/PageButton';
import StyledChip from '../../components/Styled/StyledChips';
import StyledInput from '../../components/Styled/StyledInput';
import StyledSwitchList from '../../components/Styled/StyledSwitchList';
import Wrapper from '../../components/Wrapper';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

// QUERY ONLY ONCE
let QUERY_RUNNED = false;

const mockItems = [10, 20, 30];

const restaurantDealOptions = [
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

export default function DealSettings() {
  const theme = useTheme();
  const [serverState, setServerState] = useState({});
  const [newBundleItem, setNewBundleItem] = useState('');

  // restaurant
  const [restaurantBundles, setRestaurantBundles] = useState(mockItems);
  const [showRestaurantAdd, setShowRestaurantAdd] = useState(false);
  const [restaurantOptions, setRestaurantOptions] = useState([]);
  const restaurantAddBundleRef = useRef();

  // grocery
  const [groceryBundles, setGroceryBundles] = useState(mockItems);
  const [showGroceryAdd, setShowGroceryAdd] = useState(false);
  const groceryAddBundleRef = useRef();

  // pharmacy
  const [pharmacyBundles, setPharmacyBundles] = useState(mockItems);
  const [showPharmacyAdd, setShowPharmacyAdd] = useState(false);
  const pharmacyAddBundleRef = useRef();

  // reward bundle
  const [rewardBundle, setRewardBundle] = useState([]);
  const [showAddRewardBundle, setShowAddRewardBundle] = useState(false);
  const addRewardBundleInputRef = useRef();

  const addNewBundleItem = () => {
    if (Number(newBundleItem) < 1) {
      successMsg('Reward Bundle cannot be smaller than 1');
      return;
    }

    if (Number.isNaN(Number(newBundleItem))) {
      successMsg('Please enter a valid value');
      return;
    }

    if (rewardBundle.includes(Number(newBundleItem))) {
      successMsg('Reward Bundle item already exists');
      return;
    }

    setRewardBundle((prev) => [...prev, Number(newBundleItem)]);
    setNewBundleItem('');
    setShowAddRewardBundle(false);
  };

  const deleteItem = (type, payload) => {
    switch (type) {
      case 'bundleItem':
        setRewardBundle((prev) => prev.filter((item, index) => index !== payload));
        break;

      default:
    }
  };

  const updateLocalState = (data) => {
    setRewardBundle(data?.rewardBundle || []);
  };

  useQuery(['deal-settings'], () => AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS), {
    enabled: !QUERY_RUNNED,
    onSuccess: (data) => {
      QUERY_RUNNED = false;
      setServerState(data?.data?.rewardSetting);
      console.log('backend data', data?.data?.rewardSetting);
      let newData;

      try {
        newData = JSON.parse(JSON.stringify(data?.data?.rewardSetting));
      } catch (error) {
        console.log(error);
      }

      updateLocalState(newData || {});
    },
  });

  // const updateSettingsMutation = useMutation((data) => AXIOS.post(Api.EDIT_ADMIN_REWARD_SETTINGS, data), {
  //   onSuccess: (data) => {
  //     if (data?.status) {
  //       successMsg(data?.message, 'success');
  //       let newData;

  //       try {
  //         newData = JSON.parse(JSON.stringify(data?.data?.rewardSetting));
  //       } catch (error) {
  //         console.log(error);
  //       }

  //       updateLocalState(newData || {});
  //       setFetchedData(data?.data?.rewardSetting);
  //     } else {
  //       successMsg(data?.message);
  //     }
  //   },
  //   onError: (error) => {
  //     console.log('api error: ', error);
  //   },
  // });

  // const updateSettings = () => {
  //   updateSettingsMutation.mutate({
  //     minSpendLimit,
  //     rewardBundle,
  //     rewardCategory: rewardCategory.map((item, index) => {
  //       item.sortingOrder = index;
  //       return item;
  //     }),
  //     getReward: {
  //       amount: getReward.amount,
  //       points: 1,
  //     },
  //     redeemReward: {
  //       amount: redeemReward.amount,
  //       points: 1,
  //     },
  //     adminCutForReward,
  //     expiration_period: expirationPeriod,
  //     type: [
  //       'expiration_period',
  //       'adminCutForReward',
  //       'redeemReward',
  //       'getReward',
  //       'rewardCategory',
  //       'rewardBundle',
  //       'minSpendLimit',
  //     ],
  //   });
  // };

  const discardChanges = () => {
    let data;

    try {
      data = JSON.parse(JSON.stringify(serverState));
    } catch (error) {
      console.log(error);
    }

    updateLocalState(data || {});
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
                  {showAddRewardBundle && (
                    <ClickAwayListener
                      onClickAway={() => {
                        if (showAddRewardBundle) {
                          setShowRestaurantAdd(false);
                          setNewBundleItem('');
                        }
                      }}
                    >
                      <StyledInput
                        ref={addRewardBundleInputRef}
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
                    setShowAddRewardBundle(true);
                    setTimeout(() => {
                      addRewardBundleInputRef?.current?.querySelector('input')?.focus();
                    }, 10);
                  }}
                >
                  Add bundle
                </Button>
              </Box>
              {/* options */}
              <StyledSwitchList
                items={restaurantDealOptions}
                values={restaurantOptions}
                onChange={(value) => {
                  if (restaurantOptions.includes(value)) {
                    setRestaurantOptions((prev) => prev.filter((item) => item !== value));
                  } else {
                    setRestaurantOptions((prev) => [...prev, value]);
                  }
                }}
              />
            </Box>
          </Grid>
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
                  {restaurantBundles.map((item, index) => (
                    <StyledChip
                      key={item}
                      label={item}
                      onDelete={() => {
                        deleteItem('restaurant', index);
                      }}
                    />
                  ))}
                  {showAddRewardBundle && (
                    <ClickAwayListener
                      onClickAway={() => {
                        if (showAddRewardBundle) {
                          setShowRestaurantAdd(false);
                          setNewBundleItem('');
                        }
                      }}
                    >
                      <StyledInput
                        ref={addRewardBundleInputRef}
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
                    setShowAddRewardBundle(true);
                    setTimeout(() => {
                      addRewardBundleInputRef?.current?.querySelector('input')?.focus();
                    }, 10);
                  }}
                >
                  Add bundle
                </Button>
              </Box>
              {/* options */}
              <StyledSwitchList
                items={restaurantDealOptions}
                values={restaurantOptions}
                onChange={(value) => {
                  if (restaurantOptions.includes(value)) {
                    setRestaurantOptions((prev) => prev.filter((item) => item !== value));
                  } else {
                    setRestaurantOptions((prev) => [...prev, value]);
                  }
                }}
              />
            </Box>
          </Grid>
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
                  {restaurantBundles.map((item, index) => (
                    <StyledChip
                      key={item}
                      label={item}
                      onDelete={() => {
                        deleteItem('restaurant', index);
                      }}
                    />
                  ))}
                  {showAddRewardBundle && (
                    <ClickAwayListener
                      onClickAway={() => {
                        if (showAddRewardBundle) {
                          setShowRestaurantAdd(false);
                          setNewBundleItem('');
                        }
                      }}
                    >
                      <StyledInput
                        ref={addRewardBundleInputRef}
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
                    setShowAddRewardBundle(true);
                    setTimeout(() => {
                      addRewardBundleInputRef?.current?.querySelector('input')?.focus();
                    }, 10);
                  }}
                >
                  Add bundle
                </Button>
              </Box>
              {/* options */}
              <StyledSwitchList
                items={restaurantDealOptions}
                values={restaurantOptions}
                onChange={(value) => {
                  if (restaurantOptions.includes(value)) {
                    setRestaurantOptions((prev) => prev.filter((item) => item !== value));
                  } else {
                    setRestaurantOptions((prev) => [...prev, value]);
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
            // disabled={updateSettingsMutation.isLoading}
            // onClick={() => {
            //   updateSettings();
            // }}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Wrapper>
  );
}
