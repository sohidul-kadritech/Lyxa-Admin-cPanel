// third party
import { Box, Button, Drawer, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

// project import
import PageTop from '../../../../../components/Common/PageTop';
import Taglist from '../../../../../components/Common/Taglist';
import Wrapper from '../../../../../components/Wrapper';
import { successMsg } from '../../../../../helpers/successMsg';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import BundleProducts from './BundleProducts';
import InputBox from './InputBox';
import CategoryList from './RewardCategoryList';
import StyledContainer from './StyledContainer';
import { validateRewardBundle, validateRewardCategory } from './helpers';

const getRewardInit = {
  amount: '',
  points: '',
};

export default function LoyaltySettings() {
  const [render, setRender] = useState(false);
  const [fetchedData, setFetchedData] = useState({});
  const [queryOnce, setQueryOnce] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // reward category
  const [rewardCategory, setRewardCategory] = useState([]);

  const addRewardCategory = (category, removeInputFocus, { isAddNew, isClickOutside }, toggleAddItem) => {
    if (isAddNew && isClickOutside) {
      toggleAddItem(false);
      return;
    }

    if (validateRewardCategory(category, rewardCategory)) {
      removeInputFocus();

      if (isAddNew) {
        fetchedData?.rewardCategory?.push({ ...category });
        setRewardCategory((prev) => [...prev, { ...category }]);
        toggleAddItem(false);
      }
    } else if (!isAddNew && isClickOutside) {
      setRewardCategory((prev) =>
        prev.map((item) => {
          if (item?._id === category?._id) {
            const item = fetchedData?.rewardCategory?.find((oItem) => oItem?._id === category?._id) || category;
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

      return true;
    }
    return false;
  };

  const dropSort = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;

    const item = rewardCategory.splice(removedIndex, 1);
    rewardCategory.splice(addedIndex, 0, item[0]);

    setRender(!render);
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

  useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
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

  const updateSettingsMutation = useMutation((data) => AXIOS.post(Api.EDIT_ADMIN_REWARD_SETTINGS, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data?.message, 'success');
        let newData;

        try {
          newData = JSON.parse(JSON.stringify(data?.data?.rewardSetting));
        } catch (error) {
          console.log(error);
        }

        updateLocalState(newData || {});
        setFetchedData(data?.data?.rewardSetting);
      } else {
        successMsg(data?.message);
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

    updateLocalState(data || {});
  };

  return (
    <Wrapper
      sx={{
        paddingTop: 0,
      }}
    >
      <Box className="page-content2" sx={{ height: '100vh', overflowY: 'scroll' }}>
        <PageTop backButtonLabel="Back to Marketing" backTo="/admin/settings2/marketing" title="Loyalty Points" />
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
                setRewardCategory={setRewardCategory}
                onSave={addRewardCategory}
                onViewShops={(item) => {
                  setCurrentRewardBundle(item);
                  setSidebarOpen(true);
                }}
                onDelete={(category) => {
                  setRewardCategory((prev) => prev.filter((item) => item?._id !== category?._id));
                }}
                onDrop={dropSort}
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
    </Wrapper>
  );
}
