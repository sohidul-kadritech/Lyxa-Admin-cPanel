// third party
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { Add, Close, Edit, West } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  styled,
  Typography,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';
import { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Container, Draggable } from 'react-smooth-dnd';

// project import
import HandleIcon from '../../assets/icons/handle.svg';
import PageButton from '../../components/Common/PageButton';
import StyledSwitch from '../../components/Common/StyledSwitch';
import NumberInput from '../../components/Form/NumberInput';
import Wrapper from '../../components/Wrapper';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

const rewardCategoryInit = {
  name: '',
  status: 'active',
};

const getRewardInit = {
  amount: '',
  points: '',
};

// QUERY ONLY ONCE
let QUERY_RUNNED = false;

const StyledChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.background.secondary,
  borderRadius: '30px',
  padding: '12px 30px',
  height: 'auto',
  gap: '12px',

  '& .MuiChip-label': {
    padding: '0',
    fontFamily: 'Inter',
    fontWeight: '500',
    lineHeight: '24px',
  },

  '& .MuiSvgIcon-root': {
    fontSize: '17px',
    color: '#3F4254',
    margin: '0',

    '&:hover': {
      color: '#3F4254',
      opacity: '.7',
    },
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  background: '#F3F6F9',
  borderRadius: '6px!important',
  width: '32px',
  height: '32px',

  '&:hover': {
    background: '#e9eff5',
  },

  '& .MuiSvgIcon-root': {
    fontSize: '16px',
  },
}));

export default function RewardSettings() {
  const theme = useTheme();
  const [render, setRender] = useState(false);
  const [fetchedData, setFetchedData] = useState({});

  // reward category
  const [rewardCategory, setRewardCategory] = useState([]);
  const [newRewardCategory, setNewRewardCategory] = useState({ ...rewardCategoryInit });
  const [showAddNewRewardCategory, setShowAddNewRewardCategory] = useState(false);
  const addRewardCategoryInputRef = useRef();

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
      setRewardCategory((prev) => [...prev, { ...newRewardCategory }]);
      setNewRewardCategory({ ...rewardCategoryInit });
      setShowAddNewRewardCategory(false);
    }
  };

  // reward bundle
  const [newBundleItem, setNewBundleItem] = useState('');
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

  // get reward
  const [getReward, setGetReward] = useState(getRewardInit);
  const [redeemReward, setRedeemReward] = useState(getRewardInit);
  const [adminCutForReward, setAdminCutForReward] = useState('0');
  const [expirationPeriod, setExpirationPeriod] = useState('0');
  const [minSpendLimit, setMinSpendLimit] = useState('0');

  const deleteItem = (type, payload) => {
    switch (type) {
      case 'rewardCategory':
        setRewardCategory((prev) => prev.filter((item) => item.name !== payload.name));
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
    console.log('min spend limit', data?.minSpendLimit);
    setMinSpendLimit(data?.minSpendLimit || '');
  };

  useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS), {
    enabled: !QUERY_RUNNED,
    onSuccess: (data) => {
      QUERY_RUNNED = false;
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
      rewardCategory,
      getReward: {
        amount: 1,
        points: getReward.points,
      },
      redeemReward: {
        amount: 1,
        points: redeemReward.points,
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

  const dropSort = ({ removedIndex, addedIndex }) => {
    console.log(removedIndex, addedIndex);
    if (removedIndex === null || addedIndex === null) return;

    const p = rewardCategory[removedIndex];
    const n = rewardCategory[addedIndex];

    rewardCategory[removedIndex] = n;
    rewardCategory[addedIndex] = p;

    setRender(!render);
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
        {/* settings */}
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
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Points earned value
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '370px',
                  }}
                >
                  <Typography variant="body1">Value of 1 Point</Typography>
                  <Stack direction="row" alignItems="center" gap={3}>
                    <NumberInput
                      value={getReward?.points || '0'}
                      type="number"
                      onChange={(e) => {
                        setGetReward((prev) => ({ ...prev, points: e.target.value }));
                      }}
                    />
                    <Typography variant="body1">$</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  <Box>
                    <Typography variant="h6" fontWeight={600} pb={1.5}>
                      Points used value
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        maxWidth: '370px',
                        width: '370px',
                      }}
                    >
                      <Typography variant="body1">Value of 1 Point</Typography>
                      <Stack direction="row" alignItems="center" gap={3}>
                        <NumberInput
                          type="number"
                          value={redeemReward?.points || '0'}
                          onChange={(e) => {
                            setRedeemReward((prev) => ({ ...prev, points: e.target.value }));
                          }}
                        />
                        <Typography variant="body1">$</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            {/* distributed cost */}
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Distributed Cost
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '370px',
                  }}
                >
                  <Typography variant="body1">Lyxa</Typography>
                  <Stack direction="row" alignItems="center" gap={3}>
                    <NumberInput
                      type="number"
                      value={adminCutForReward}
                      onChange={(e) => {
                        setAdminCutForReward(e.target.value);
                      }}
                    />
                    <Typography variant="body1">%</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                <Stack
                  direction="row"
                  alignItems="flex-end"
                  justifyContent="flex-end"
                  sx={{
                    height: '100%',
                  }}
                >
                  <Stack
                    justifyContent="flex-end"
                    sx={{
                      height: '100%',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        maxWidth: '370px',
                        width: '370px',
                        pr: 4.5,
                      }}
                    >
                      <Typography variant="body1"> Shop</Typography>
                      <NumberInput type="text" value={`${Number(100 - adminCutForReward)}%`} />
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            {/* categories */}
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={12}>
                <Typography variant="h6" fontWeight={600} pb={6.5}>
                  Categories
                </Typography>
                {/* categories container */}
                <Stack gap={2.5} pb={6}>
                  {/* item */}
                  <Container
                    onDrop={dropSort}
                    lockAxis="y"
                    dragHandleSelector=".drag-handler"
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexDirection: 'column',
                    }}
                  >
                    {rewardCategory.map((item) => (
                      <Draggable key={item.name}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          {/* left */}
                          <Stack alignItems="center" direction="row" gap="30px">
                            <span className="drag-handler grabable">
                              <img
                                src={HandleIcon}
                                alt="icon"
                                style={{
                                  width: '14px',
                                }}
                              />
                            </span>
                            <StyledChip label={item.name} />
                          </Stack>
                          {/* right */}
                          <Stack direction="row" justifyContent="flex-end" gap={11}>
                            <StyledSwitch
                              checked={item.status === 'active'}
                              onChange={(event) => {
                                item.status = event.target.checked ? 'active' : 'inactive';
                                setRender(!render);
                              }}
                            />
                            <Stack direction="row" gap={2.5}>
                              <StyledIconButton color="secondary">
                                <Edit />
                              </StyledIconButton>
                              <StyledIconButton
                                color="secondary"
                                onClick={() => {
                                  deleteItem('rewardCategory', item);
                                }}
                              >
                                <Close />
                              </StyledIconButton>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Draggable>
                    ))}
                  </Container>
                  {showAddNewRewardCategory && (
                    <ClickAwayListener
                      onClickAway={() => {
                        if (showAddNewRewardCategory) {
                          setShowAddNewRewardCategory(false);
                          setNewRewardCategory({ ...rewardCategoryInit });
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        {/* left */}
                        <Stack alignItems="center" direction="row" gap="30px">
                          <img
                            src={HandleIcon}
                            alt="icon"
                            style={{
                              width: '14px',
                            }}
                          />
                          <NumberInput
                            value={newRewardCategory.name}
                            ref={addRewardCategoryInputRef}
                            sx={{
                              width: 'auto',
                              maxWidth: '200px',
                              '& input': {
                                fontSize: '13px',
                              },
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                addRewardCategory();
                              }
                            }}
                            onChange={(event) => {
                              setNewRewardCategory((prev) => ({ ...prev, name: event.target.value }));
                            }}
                          />
                        </Stack>
                        {/* right */}
                        <Stack direction="row" justifyContent="flex-end" gap={11}>
                          <StyledSwitch
                            checked={newRewardCategory.status === 'active'}
                            onChange={(event) => {
                              setNewRewardCategory((prev) => ({
                                ...prev,
                                status: event.target.checked ? 'active' : 'inactive',
                              }));
                            }}
                          />
                          <Stack direction="row" gap={2.5}>
                            <StyledIconButton color="secondary">
                              <Edit />
                            </StyledIconButton>
                            <StyledIconButton color="secondary">
                              <Close />
                            </StyledIconButton>
                          </Stack>
                        </Stack>
                      </Stack>
                    </ClickAwayListener>
                  )}
                </Stack>
                <Button
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
                    setShowAddNewRewardCategory(true);
                    setTimeout(() => {
                      addRewardCategoryInputRef?.current?.querySelector('input')?.focus();
                    }, 10);
                  }}
                >
                  Add category
                </Button>
              </Grid>
              <Grid xs={12} md={6}></Grid>
            </Grid>
            {/* reward bundle */}
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12}>
                <Typography variant="h6" fontWeight={600} pb={4}>
                  Reward Bundle
                </Typography>
                <Stack direction="row" gap={2} alignItems="center"></Stack>
                <Stack direction="row" gap={4} mb={6}>
                  {rewardBundle.map((item, index) => (
                    <StyledChip
                      key={item}
                      label={item}
                      onDelete={() => {
                        deleteItem('bundleItem', index);
                      }}
                    />
                  ))}
                  {showAddRewardBundle && (
                    <ClickAwayListener
                      onClickAway={() => {
                        if (showAddRewardBundle) {
                          setShowAddRewardBundle(false);
                          setNewBundleItem('');
                        }
                      }}
                    >
                      <NumberInput
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
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* spending limits */}
            <Grid
              xs={12}
              container
              sx={{
                borderBottom: '1px dashed #E5E5E5',
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Spending Limits
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '370px',
                  }}
                >
                  <Typography variant="body1">Minimum spending limit/week</Typography>
                  <Stack direction="row" alignItems="center" gap={3}>
                    <NumberInput
                      type="number"
                      value={minSpendLimit}
                      onChange={(event) => {
                        setMinSpendLimit(event.target.value);
                      }}
                    />
                    <Typography variant="body1">$</Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            {/* expiration */}
            <Grid
              xs={12}
              container
              sx={{
                pt: 6,
                pb: 8,
              }}
            >
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} pb={1.5}>
                  Expiration
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    maxWidth: '370px',
                  }}
                >
                  <Typography variant="body1">Number of days</Typography>
                  <Stack direction="row" alignItems="center" gap={3}>
                    <NumberInput
                      type="number"
                      value={expirationPeriod}
                      onChange={(e) => {
                        setExpirationPeriod(e.target.value);
                      }}
                    />
                    <Typography variant="body1">D</Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
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
    </Wrapper>
  );
}
