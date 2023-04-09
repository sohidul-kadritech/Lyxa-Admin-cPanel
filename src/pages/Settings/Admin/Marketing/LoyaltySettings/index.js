// third party
import { Box, Button, Drawer, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

// project import
import ConfirmModal from '../../../../../components/Common/ConfirmModal';
import PageTop from '../../../../../components/Common/PageTop';
import Taglist from '../../../../../components/Common/Taglist';
import Wrapper from '../../../../../components/Wrapper';
import { successMsg } from '../../../../../helpers/successMsg';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import BundleProducts from './BundleProducts';
import InputBox from './InputBox';
import CategoryList from './RewardCategoryList';
import SkeletonLoader from './SkeletonLoader';
import StyledContainer from './StyledContainer';
import { confirmActionInit, validateRewardBundle, validateRewardCategory } from './helpers';

const getRewardInit = {
  amount: '',
  points: '',
};

export default function LoyaltySettings() {
  const [render, setRender] = useState(false);
  const [fetchedData, setFetchedData] = useState({});
  const [queryOnce, setQueryOnce] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globaChange, setGlobalChange] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(confirmActionInit);

  // reward category
  const [rewardCategory, setRewardCategory] = useState([]);
  const [tempRewardCategory] = useState([]);
  console.log(rewardCategory);

  const addRewardCategory = (category, removeInputFocus, { isAddNew, isClickOutside }, toggleAddItem) => {
    if (isAddNew && isClickOutside) {
      toggleAddItem(false);
      return;
    }

    if (validateRewardCategory(category, rewardCategory)) {
      removeInputFocus();

      if (isAddNew) {
        tempRewardCategory.push({ ...category });
        setRewardCategory((prev) => [...prev, { ...category }]);
        toggleAddItem(false);
        setGlobalChange(true);
      }
    } else if (!isAddNew && isClickOutside) {
      let oldList;

      if (category?._id?.startsWith('xxx')) {
        oldList = tempRewardCategory;
      } else {
        oldList = fetchedData?.rewardCategory || [];
      }

      setRewardCategory((prev) =>
        prev.map((item) => {
          if (item?._id === category?._id) {
            const item = oldList.find((oItem) => oItem?._id === category?._id) || category;
            return { ...category, name: item?.name };
          }
          return item;
        })
      );
    }
  };

  // reward bundle
  const [rewardBundle, setRewardBundle] = useState([]);
  const [currentRewardBundle, setCurrentRewardBundle] = useState({});

  const addNewBundleItem = (bundle) => {
    if (validateRewardBundle(bundle, rewardBundle)) {
      setRewardBundle((prev) => [...prev, Number(bundle)]);
      setGlobalChange(true);

      return true;
    }
    return false;
  };

  const dropSort = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;

    const item = rewardCategory.splice(removedIndex, 1);
    rewardCategory.splice(addedIndex, 0, item[0]);

    setRender(!render);
    setGlobalChange(true);
  };

  // get reward
  const [getReward, setGetReward] = useState(getRewardInit);
  const [redeemReward, setRedeemReward] = useState(getRewardInit);
  const [adminCutForReward, setAdminCutForReward] = useState('0');
  const [expirationPeriod, setExpirationPeriod] = useState('0');
  const [minSpendLimit, setMinSpendLimit] = useState('0');

  const updateLocalState = (data) => {
    setRewardCategory(data?.rewardCategory || []);
    setRewardBundle(data?.rewardBundle || []);
    setGetReward(data?.getReward || {});
    setRedeemReward(data?.redeemReward || {});
    setAdminCutForReward(data?.adminCutForReward || '');
    setExpirationPeriod(data?.expiration_period || '');
    console.log('min spend limit', data?.minSpendLimit);
    setMinSpendLimit(data?.minSpendLimit || '');
  };

  const settingsQuery = useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
    enabled: !queryOnce,
    onSuccess: (data) => {
      setQueryOnce(true);
      setFetchedData(data?.data?.rewardSetting);
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

  useEffect(() => {
    let newData;
    try {
      newData = JSON.parse(JSON.stringify(settingsQuery?.data?.data?.rewardSetting || {}));
    } catch (error) {
      console.log(error);
    }
    updateLocalState(newData || {});
  }, []);

  const updateSettingsMutation = useMutation((data) => AXIOS.post(Api.EDIT_ADMIN_REWARD_SETTINGS, data), {
    onSuccess: (data) => {
      successMsg(data?.message, 'success');

      if (data?.status) {
        setGlobalChange(false);
        let newData;

        try {
          newData = JSON.parse(JSON.stringify(data?.data?.rewardSetting));
        } catch (error) {
          console.log(error);
        }

        updateLocalState(newData || {});
        setFetchedData(data?.data?.rewardSetting);
      }
    },
    onError: (error) => {
      console.log('api error: ', error);
    },
  });

  const updateSettings = () => {
    updateSettingsMutation.mutate({
      minSpendLimit,
      rewardBundle,
      rewardCategory: rewardCategory.map((item, index) => {
        item.sortingOrder = index + 1;
        if (item?._id?.startsWith('xxx')) {
          return {
            ...item,
            _id: undefined,
          };
        }
        return item;
      }),
      getReward: {
        amount: getReward.amount,
        points: 1,
      },
      redeemReward: {
        amount: redeemReward.amount,
        points: 1,
      },
      adminCutForReward,
      expiration_period: expirationPeriod,
      type: [
        'expiration_period',
        'adminCutForReward',
        'redeemReward',
        'getReward',
        'rewardCategory',
        'rewardBundle',
        'minSpendLimit',
      ],
    });
  };

  const discardChanges = () => {
    let data;

    try {
      data = JSON.parse(JSON.stringify(fetchedData));
    } catch (error) {
      console.log(error);
    }

    if (globaChange) {
      setConfirmModal(true);

      setConfirmAction({
        message: 'All your changes will be lost?',
        onCancel: () => setConfirmModal(false),
        onConfirm: () => {
          updateLocalState(data || {});
          setGlobalChange(false);
          setConfirmModal(false);
        },
      });
    }
  };

  return (
    <Wrapper
      sx={{
        paddingTop: 0,
      }}
    >
      <Box className="page-content2" sx={{ height: '100vh', overflowY: 'scroll' }}>
        <PageTop backButtonLabel="Back to Marketing" backTo="/admin/settings2/marketing" title="Loyalty Points" />
        {settingsQuery.isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            <Box
              sx={{
                background: '#fff',
                borderRadius: '6px',
                pl: 10,
                pr: 10,
              }}
            >
              <Grid container>
                {/* value per points */}
                <StyledContainer title="Points earned value">
                  <InputBox
                    title="Value of 1 Point"
                    endAdornment="$"
                    inputValue={getReward?.amount || '0'}
                    inputType="number"
                    onInputChange={(e) => {
                      setGetReward((prev) => ({ ...prev, amount: e.target.value }));
                      setGlobalChange(true);
                    }}
                  />
                </StyledContainer>
                <StyledContainer title="Points used value" placement="end">
                  <InputBox
                    placement="end"
                    title="Value of 1 Point"
                    endAdornment="$"
                    inputValue={redeemReward?.amount || '0'}
                    inputType="number"
                    onInputChange={(e) => {
                      setRedeemReward((prev) => ({ ...prev, amount: e.target.value }));
                      setGlobalChange(true);
                    }}
                  />
                </StyledContainer>
                {/* distributed cost */}
                <StyledContainer title="Distributed Cost">
                  <InputBox
                    title="Lyxa"
                    endAdornment="%"
                    inputValue={adminCutForReward}
                    inputType="number"
                    onInputChange={(e) => {
                      setAdminCutForReward(e.target.value);
                      setGlobalChange(true);
                    }}
                  />
                </StyledContainer>
                <StyledContainer title="" placement="end">
                  <InputBox
                    placement="end"
                    title="Shop"
                    endAdornment="$"
                    inputValue={`${Number(100 - adminCutForReward)}%`}
                    inputType="text"
                    onInputChange={() => {}}
                  />
                </StyledContainer>
                {/* categories */}
                <StyledContainer title="Categories" xs={12} lg={12}>
                  <CategoryList
                    rewardCategories={rewardCategory}
                    onSave={addRewardCategory}
                    onViewShops={(item) => {
                      setCurrentRewardBundle(item);
                      setSidebarOpen(true);
                    }}
                    onDelete={(category) => {
                      setRewardCategory((prev) => prev.filter((item) => item?._id !== category?._id));
                      setGlobalChange(true);
                    }}
                    onDrop={dropSort}
                    setGlobalChange={() => {
                      setGlobalChange(true);
                    }}
                  />
                </StyledContainer>
                <StyledContainer title="Reward Bundle" xs={12} lg={12}>
                  <Taglist
                    listContainerSx={{
                      mb: 2.5,
                      mt: 2,
                    }}
                    addButtonLabel="Add"
                    items={rewardBundle}
                    onAdd={(value) => addNewBundleItem(value)}
                    onDelete={(item, index, array) => {
                      array.splice(index, 1);
                      setRender((prev) => !prev);
                      setGlobalChange(true);
                    }}
                  />
                </StyledContainer>
                {/* spending limits */}
                <StyledContainer title="Spending Limits" xs={12} lg={12}>
                  <InputBox
                    title="Minimum spending limit/week"
                    endAdornment="$"
                    inputValue={minSpendLimit}
                    inputType="number"
                    onInputChange={(e) => {
                      setMinSpendLimit(e.target.value);
                      setGlobalChange(true);
                    }}
                  />
                </StyledContainer>
                {/* expiration */}
                <StyledContainer title="Expiration" xs={12} lg={12}>
                  <InputBox
                    title="Number of days"
                    endAdornment="D"
                    inputValue={expirationPeriod}
                    inputType="number"
                    onInputChange={(e) => {
                      setExpirationPeriod(e.target.value);
                      setGlobalChange(true);
                    }}
                  />
                </StyledContainer>
              </Grid>
            </Box>
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
      {sidebarOpen && (
        <Drawer open={sidebarOpen} anchor="right">
          <BundleProducts
            rewardBundle={currentRewardBundle}
            onClose={() => {
              setSidebarOpen(false);
            }}
          />
        </Drawer>
      )}
      <ConfirmModal
        message={confirmAction.message}
        isOpen={confirmModal}
        blurClose
        onCancel={confirmAction.onCancel}
        onConfirm={confirmAction.onConfirm}
      />
    </Wrapper>
  );
}
