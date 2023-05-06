// third party, Typography
import { Box, Button, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

// project import
import { confirmActionInit } from '../../../../../assets/staticData';
import ConfirmModal from '../../../../../components/Common/ConfirmModal';
import PageTop from '../../../../../components/Common/PageTop';
import Taglist from '../../../../../components/Common/Taglist';
import StyledSwitchList from '../../../../../components/Styled/StyledSwitchList';
import { deepClone } from '../../../../../helpers/deepClone';
import { successMsg } from '../../../../../helpers/successMsg';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import SkeletonLoader from './SkeletonLoader';
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

const breadcrumbItems = [
  { label: 'Settings', to: '/admin/settings2' },
  { label: 'Marketing', to: '/admin/settings2/marketing' },
  { label: 'Deals', to: '#' },
];

export default function DealSettings() {
  const [backupState, setBackupState] = useState({});
  const [runQuery, setRunQuery] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(confirmActionInit);
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
    setIsChanged(true);
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

  const settingsQuery = useQuery(
    ['deal-settings'],
    () =>
      AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS, {
        params: {
          type: 'all',
        },
      }),
    {
      enabled: runQuery,
      onSuccess: (data) => {
        setRunQuery(false);

        if (data?.status) {
          setBackupState(data?.data?.dealSetting);

          const newData = deepClone(data?.data?.dealSetting);
          updateLocalState(newData || []);
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
      },
    }
  );

  useEffect(() => {
    if (settingsQuery?.data?.status) {
      setBackupState(settingsQuery?.data?.data?.dealSetting);

      const newData = deepClone(settingsQuery?.data?.data?.dealSetting);
      updateLocalState(newData || []);
    }
  }, []);

  const updateSettingsMutation = useMutation((data) => AXIOS.post(Api.EDIT_ADMIN_DEAL_SETTINGS, data), {
    onSuccess: (data) => {
      successMsg(data?.message, 'success');
      if (data?.status) {
        setBackupState(data?.data?.dealSetting);
        const newData = deepClone(data?.data?.dealSetting);
        updateLocalState(newData || []);
        setIsChanged(false);
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
    if (isChanged) {
      setConfirmModal(true);
      setConfirmAction({
        message: 'All your changes will be lost?',
        onCancel: () => {
          setConfirmModal(false);
        },
        onConfirm: () => {
          updateLocalState(deepClone(backupState) || []);
          setConfirmModal(false);
          setIsChanged(false);
        },
      });
    }
  };

  return (
    <Box>
      <Box>
        {/* top */}
        <PageTop
          backButtonLabel="Back to Marketing"
          backTo="/admin/settings2/marketing"
          breadcrumbItems={breadcrumbItems}
        />
        {settingsQuery.isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
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
                        setIsChanged(true);
                      }}
                    />
                  </Box>
                  {/* options */}
                  <StyledSwitchList
                    items={dealTypes}
                    values={restaurantDeals}
                    onChange={(value) => {
                      setIsChanged(true);
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
                <StyledBox title="Grocery">
                  <Box pb={6}>
                    <Typography variant="h6" pb={4}>
                      Percentage Bundle
                    </Typography>
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
                        setIsChanged(true);
                      }}
                    />
                  </Box>
                  {/* options */}
                  <StyledSwitchList
                    items={dealTypes}
                    values={groceryDeals}
                    onChange={(value) => {
                      setIsChanged(true);
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
                      onAdd={(value) => addNewBundleItem('pharmacy', value)}
                      onDelete={(item, index, array) => {
                        array.splice(index, 1);
                        setRender((prev) => !prev);
                        setIsChanged(true);
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
                      setIsChanged(true);
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
                color="primary"
                onClick={() => {
                  discardChanges();
                }}
              >
                Discard
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={updateSettingsMutation.isLoading}
                onClick={() => {
                  updateSettings();
                }}
              >
                Save Changes
              </Button>
            </Stack>
          </>
        )}
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
