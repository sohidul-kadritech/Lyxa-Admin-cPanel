// thrid party
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

// project import
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import ConfirmModal from '../../components/Common/ConfirmModal';
import GlobalWrapper from '../../components/GlobalWrapper';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: 'admin/settings/reward-settings',
    label: 'Reward Settings',
  },
];

// static
const livStatusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const deleteModalInit = {
  open: false,
  message: '',
  onConfirm: () => {},
};

const rewardCategoryInit = {
  name: '',
  status: '',
};

const getRewardInit = {
  amount: '',
  points: '',
};

// QUERY ONLY ONCE
let QUERY_RUNNED = false;

export default function RewardSettings() {
  const theme = useTheme();
  // query only once

  // reward category
  const [rewardCategory, setRewardCategory] = useState([]);
  const [newRewardCategory, setNewRewardCategory] = useState(rewardCategoryInit);

  const validateRewardCategory = (category) => {
    if (!category?.name?.trim()) {
      successMsg('Reward Category must have a name');
      return false;
    }

    if (rewardCategory.find((item) => item.name === category.name)) {
      successMsg('The category name already exists');
      return false;
    }

    if (!category?.status?.trim()) {
      successMsg('Reward Category must have a status');
      return false;
    }

    return true;
  };

  const addRewardCategory = () => {
    if (validateRewardCategory(newRewardCategory)) {
      setRewardCategory((prev) => [newRewardCategory, ...prev]);
      setNewRewardCategory(rewardCategoryInit);
    }
  };

  // reward bundle
  const [newBundleItem, setNewBundleItem] = useState('');
  const [rewardBundle, setRewardBundle] = useState([]);

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

    setRewardBundle((prev) => [Number(newBundleItem), ...prev]);
    setNewBundleItem('');
  };

  // get reward
  const [getReward, setGetReward] = useState(getRewardInit);
  const [redeemReward, setRedeemReward] = useState(getRewardInit);
  const [adminCutForReward, setAdminCutForReward] = useState('0');
  const [expirationPeriod, setExpirationPeriod] = useState('0');

  // delete modal
  const [deleteModal, setDeleteModal] = useState(deleteModalInit);

  const deleteItem = (type, payload) => {
    switch (type) {
      case 'rewardCategory':
        setDeleteModal({
          open: true,
          message: 'Do you want to delete this reward category?',
          onConfirm: () => {
            setRewardCategory((prev) => prev.filter((item) => item.name !== payload.name));
            setDeleteModal(deleteModalInit);
          },
        });
        break;

      case 'bundleItem':
        setRewardBundle((prev) => prev.filter((item, index) => index !== payload));
        break;

      default:
    }
  };

  const updateLocalState = (data) => {
    setRewardCategory(data?.rewardCategory || []);
    setRewardBundle(data?.rewardBundle || []);
    setGetReward(data?.getReward || {});
    setRedeemReward(data?.redeemReward || {});
    setAdminCutForReward(data?.adminCutForReward || '');
    setExpirationPeriod(data?.expiration_period || '');
  };

  const settingsQuery = useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
    enabled: !QUERY_RUNNED,
    onSuccess: (data) => {
      QUERY_RUNNED = false;
      updateLocalState(data?.data?.rewardSetting || {});
    },
  });

  const updateSettings = useMutation((data) => AXIOS.post(Api.EDIT_ADMIN_REWARD_SETTINGS, data), {
    onSuccess: (data) => {
      updateLocalState(data?.data?.rewardSetting || {});
    },
    onError: (error) => {
      console.log('api error: ', error);
    },
  });

  return (
    <GlobalWrapper padding>
      <Box className="page-content2">
        <Grid container gap={5}>
          <Grid xs={12}>
            <BreadCrumbs items={breadcrumbItems} />
          </Grid>
          {/* Reward Category */}
          <Grid md={4}>
            <Box
              padding={5}
              sx={{
                borderRadius: '6px',
                border: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Typography variant="h3" pb={5}>
                Reward Category
              </Typography>
              <Stack gap={4}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={newRewardCategory.name}
                  onChange={(e) => {
                    setNewRewardCategory((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={newRewardCategory.status}
                    onChange={(e) => {
                      setNewRewardCategory((prev) => ({ ...prev, status: e.target.value }));
                    }}
                  >
                    {livStatusOptions.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  disabled={settingsQuery.isLoading || updateSettings.isLoading}
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    addRewardCategory();
                  }}
                >
                  Add
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={settingsQuery.isLoading || updateSettings.isLoading}
                  onClick={() => {
                    updateSettings.mutate({
                      rewardCategory,
                      type: ['rewardCategory'],
                    });
                  }}
                >
                  Update
                </Button>
              </Stack>
              {/* category list */}
              <Typography
                variant="h6"
                pb={5}
                pt={5}
                sx={{
                  fontWeight: '500',
                }}
              >
                List
              </Typography>
              <Stack spacing={5}>
                {rewardCategory.map((item) => (
                  <Stack
                    key={item.name}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      background: theme.palette.grey[100],
                      padding: '8px',
                      borderRadius: '4px',
                      border: `1px solid ${theme.palette.grey[200]}`,
                    }}
                  >
                    <Stack gap={2}>
                      <Typography variant="body1">Name: {item.name}</Typography>
                      <Typography variant="body1" textTransform="capitalize">
                        Staus: {item.status}
                      </Typography>
                    </Stack>
                    <Box>
                      <IconButton
                        onClick={() => {
                          deleteItem('rewardCategory', item);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Stack>
                ))}
                {rewardCategory?.length === 0 && <Typography variant="body1">No category found</Typography>}
              </Stack>
            </Box>
          </Grid>
          {/*  Reward Bundle */}
          <Grid md={4}>
            <Box
              padding={5}
              sx={{
                borderRadius: '6px',
                border: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Typography variant="h3" pb={5}>
                Reward Bundle
              </Typography>
              <Stack gap={4}>
                <TextField
                  label="Bundle Pts"
                  variant="outlined"
                  type="number"
                  value={newBundleItem}
                  onChange={(e) => {
                    setNewBundleItem(e.target.value);
                  }}
                />
                <Button
                  disabled={settingsQuery.isLoading || updateSettings.isLoading}
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    addNewBundleItem();
                  }}
                >
                  Add
                </Button>
                <Button
                  disabled={settingsQuery.isLoading || updateSettings.isLoading}
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    updateSettings.mutate({
                      rewardBundle,
                      type: ['rewardBundle'],
                    });
                  }}
                >
                  Update
                </Button>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={3}
                  padding={3}
                  sx={{
                    background: theme.palette.grey[100],
                    borderRadius: '6px',
                    border: `1px solid ${theme.palette.grey[200]}`,
                    minHeight: '50px',
                  }}
                >
                  {rewardBundle.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => {
                        deleteItem('bundleItem', index);
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Grid>
          {/* Get Reward */}
          <Grid md={4}>
            <Box
              padding={5}
              sx={{
                borderRadius: '6px',
                border: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Typography variant="h3" pb={5}>
                Get Reward
              </Typography>
              <Stack gap={4}>
                <TextField
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={getReward?.amount || ''}
                  onChange={(e) => {
                    setGetReward((prev) => ({ ...prev, amount: e.target.value }));
                  }}
                />
                <TextField
                  label="Points"
                  variant="outlined"
                  type="number"
                  value={getReward?.points || ''}
                  onChange={(e) => {
                    setGetReward((prev) => ({ ...prev, points: e.target.value }));
                  }}
                />
                <Button
                  disabled={settingsQuery.isLoading || updateSettings.isLoading}
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    updateSettings.mutate({
                      getReward,
                      type: ['getReward'],
                    });
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Grid>
          {/* Redeem Reward */}
          <Grid md={4}>
            <Box
              padding={5}
              sx={{
                borderRadius: '6px',
                border: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Typography variant="h3" pb={5}>
                Redeem Reward
              </Typography>
              <Stack gap={4}>
                <TextField
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={redeemReward?.amount || ''}
                  onChange={(e) => {
                    setRedeemReward((prev) => ({ ...prev, amount: e.target.value }));
                  }}
                />
                <TextField
                  label="Points"
                  variant="outlined"
                  type="number"
                  value={redeemReward?.points || ''}
                  onChange={(e) => {
                    setRedeemReward((prev) => ({ ...prev, points: e.target.value }));
                  }}
                />
                <Button
                  disabled={settingsQuery.isLoading || updateSettings.isLoading}
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    updateSettings.mutate({
                      redeemReward,
                      type: ['redeemReward'],
                    });
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Grid>
          {/* admin cut */}
          <Grid md={4}>
            <Box
              padding={5}
              sx={{
                borderRadius: '6px',
                border: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Typography variant="h3" pb={5}>
                Admin Cut
              </Typography>
              <Stack gap={4}>
                <TextField
                  label="Percentage"
                  variant="outlined"
                  type="number"
                  value={adminCutForReward}
                  onChange={(e) => {
                    setAdminCutForReward(e.target.value);
                  }}
                />
                <Button
                  disabled={settingsQuery.isLoading || updateSettings.isLoading}
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    updateSettings.mutate({
                      adminCutForReward,
                      type: ['adminCutForReward'],
                    });
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Grid>
          {/* Expiration Period */}
          <Grid md={4}>
            <Box
              padding={5}
              sx={{
                borderRadius: '6px',
                border: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Typography variant="h3" pb={5}>
                Expiration Period
              </Typography>
              <Stack gap={4}>
                <TextField
                  label="Days"
                  variant="outlined"
                  type="number"
                  value={expirationPeriod}
                  onChange={(e) => {
                    setExpirationPeriod(e.target.value);
                  }}
                />
                <Button
                  disabled={settingsQuery.isLoading || updateSettings.isLoading}
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    updateSettings.mutate({
                      expiration_period: expirationPeriod,
                      type: ['expiration_period'],
                    });
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
        {/* Reward Category delete modal */}
        <ConfirmModal
          isOpen={deleteModal.open}
          message={deleteModal.message}
          onConfirm={deleteModal.onConfirm}
          onCancel={() => {
            setDeleteModal(deleteModalInit);
          }}
        />
      </Box>
    </GlobalWrapper>
  );
}
