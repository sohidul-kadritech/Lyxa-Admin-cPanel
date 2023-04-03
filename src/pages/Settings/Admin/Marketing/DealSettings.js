// third party, Typography
import { West } from '@mui/icons-material';
import { Box, Button, Unstable_Grid2 as Grid, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

// project import
import PageButton from '../../../../components/Common/PageButton';
import Taglist from '../../../../components/Common/Taglist';
import StyledSwitchList from '../../../../components/Styled/StyledSwitchList';
import Wrapper from '../../../../components/Wrapper';
import { deepClone } from '../../../../helpers/deepClone';
import { successMsg } from '../../../../helpers/successMsg';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import StyledBox from './StyledBox';

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
// const QUERY_RUNNED = false;

export default function DealSettings() {
  const theme = useTheme();
  const [serverState, setServerState] = useState({});
  const [queryRunned, setQueryRunned] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  // restaurant
  const [restaurantBundles, setRestaurantBundles] = useState([]);
  const [restaurantDeals, setRestaurantDeals] = useState([]);

  // grocery
  const [groceryBundles, setGroceryBundles] = useState([]);
  const [groceryDeals, setGroceryDeals] = useState([]);

  // pharmacy
  const [pharmacyBundles, setPharmacyBundles] = useState([]);
  const [pharmacyDeals, setPharmacyDeals] = useState([]);

  const addNewBundleItem = (type, value) => {
    if (Number(value) < 1) {
      successMsg('Reward Bundle cannot be smaller than 1');
      return false;
    }

    if (Number(value) > 100) {
      successMsg('Reward Bundle cannot be greater than 100');
      return false;
    }

    if (Number.isNaN(Number(value))) {
      successMsg('Please enter a valid value');
      return false;
    }

    let oldList;
    let setOldList;

    if (type === 'pharmacy') {
      oldList = pharmacyBundles;
      setOldList = setPharmacyBundles;
    } else if (type === 'grocery') {
      oldList = groceryBundles;
      setOldList = setGroceryBundles;
    } else {
      oldList = restaurantBundles;
      setOldList = setRestaurantBundles;
    }

    if (oldList.includes(Number(value))) {
      successMsg('Reward Bundle item already exists');
      return false;
    }

    setOldList((prev) => [...prev, Number(value)]);
    return true;
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
      enabled: !queryRunned,
      onSuccess: (data) => {
        setQueryRunned(true);

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
          <PageButton label="Back to Marketing" startIcon={<West />} to="/admin/settings2/marketing" />
          <Typography
            variant="h4"
            color={theme.palette.text.heading}
            sx={{
              pt: 5,
              pb: 2,
            }}
          >
            Deals
          </Typography>
        </Box>
        <Grid container spacing="25px">
          {/* restaurant */}
          <Grid xs={12}>
            <StyledBox title="Food">
              <Box pb={6}>
                <Typography variant="h6" pb={4}>
                  Percentage Bundle
                </Typography>
                <Taglist
                  listContainerSx={{
                    mb: 2.5,
                  }}
                  addButtonLabel="Add bundle"
                  items={restaurantBundles}
                  onAdd={(value) => addNewBundleItem('restaurant', value)}
                  onDelete={(item, index, array) => {
                    array.splice(index, 1);
                    setRender((prev) => !prev);
                  }}
                />
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
            </StyledBox>
          </Grid>
          {/* grocery */}
          <Grid xs={12}>
            <StyledBox title="Percentage Bundle">
              <Box pb={6}>
                <Typography variant="h6" pb={4}></Typography>
                <Taglist
                  listContainerSx={{
                    mb: 2.5,
                  }}
                  addButtonLabel="Add bundle"
                  items={groceryBundles}
                  onAdd={(value) => addNewBundleItem('grocery', value)}
                  onDelete={(item, index, array) => {
                    array.splice(index, 1);
                    setRender((prev) => !prev);
                  }}
                />
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
            </StyledBox>
          </Grid>
          {/* prarmacy */}
          <Grid xs={12}>
            <StyledBox title="Pharmacy">
              <Box pb={6}>
                <Typography variant="h6" pb={4}>
                  Percentage Bundle
                </Typography>
                <Taglist
                  listContainerSx={{
                    mb: 2.5,
                  }}
                  addButtonLabel="Add bundle"
                  items={pharmacyBundles}
                  onAdd={(value) => addNewBundleItem('prarmacy', value)}
                  onDelete={(item, index, array) => {
                    array.splice(index, 1);
                    setRender((prev) => !prev);
                  }}
                />
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
            </StyledBox>
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
