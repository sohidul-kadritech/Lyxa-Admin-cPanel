import { Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import Taglist from '../../components/Common/Taglist';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import StyledBox from '../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';

// eslint-disable-next-line no-unused-vars
const ratingOptions = [
  { label: '★', value: '1' },
  { label: '★★', value: '2' },
  { label: '★★★', value: '3' },
  { label: '★★★★', value: '4' },
  { label: '★★★★★', value: '5' },
];

const ratingTypes = [
  { label: 'Shop', value: 'shop' },
  { label: 'Rider', value: 'deliveryBoy' },
];

// eslint-disable-next-line no-unused-vars
const initRating = {
  rating: '4',
  tags: [],
  type: 'shop',
};

export const validateList = (newValue, oldList) => {
  if (newValue.length < 1) {
    successMsg('Tag cannot be smaller than 1 character');
    return false;
  }

  if (oldList.includes(newValue)) {
    successMsg('Tag item already exists');
    return false;
  }

  return true;
};
// eslint-disable-next-line no-unused-vars
function AddRating({ onClose, submitHandler, isEdit, rating, loading, refetchFlags }) {
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line no-unused-vars
  const [faqType, setFaqType] = useState('');
  const queryClient = useQueryClient();

  const [currentRating, setCurrentRating] = useState({ ...initRating });
  // add new rating
  const addNewRating = useMutation((ratings) => AXIOS.post(API_URL.ADD_NEW_RATING, ratings), {
    onSuccess: (data) => {
      if (data?.status) {
        onClose();
        refetchFlags();
        queryClient.invalidateQueries({ queryKey: [API_URL.GET_ALL_RATINGS] });
        successMsg('Successfully Added', 'success');
      } else {
        successMsg(data?.message, 'warn');
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateRatings = useMutation((ratings) => AXIOS.post(API_URL.UPDATE_RATING, ratings), {
    onSuccess: (data) => {
      if (data?.status) {
        onClose();
        refetchFlags();
        queryClient.invalidateQueries({ queryKey: ['ratting_settings'] });
        successMsg('Successfully Updated', 'success');
      } else {
        successMsg(data?.message, 'warn');
      }
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // eslint-disable-next-line no-unused-vars
  const submitRatings = () => {
    if (isEdit) {
      updateRatings.mutate({ ...currentRating, id: currentRating?._id });
    } else {
      addNewRating.mutate(currentRating);
    }
  };

  useEffect(() => {
    setCurrentRating({ ...rating });
  }, [rating]);

  const addNewBundleItem = (bundle) => {
    if (validateList(bundle, currentRating.tags))
      setCurrentRating((prev) => ({ ...prev, tags: [bundle.trim(), ...prev.tags] }));
  };

  return (
    <SidebarContainer title={`${isEdit === false ? 'Add New Rating' : 'Edit Rating'}`} onClose={onClose}>
      <Stack spacing={6} paddingBottom="40px">
        <Stack direction="column" spacing={5}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '18px',
            }}
          >
            Type
          </Typography>
          <OptionsSelect
            items={ratingTypes.filter((type) => currentRating?.type === type.value)}
            value={currentRating?.type}
            disabled={isEdit}
            onChange={(value) => {
              setCurrentRating((prev) => ({ ...prev, type: value }));
            }}
          />
        </Stack>

        <Stack direction="column" spacing={5}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '18px',
            }}
          >
            Rating
          </Typography>
          <OptionsSelect
            items={ratingOptions}
            value={`${currentRating?.rating}`}
            disabled={isEdit}
            onChange={(value) => {
              setCurrentRating((prev) => ({ ...prev, rating: value }));
            }}
          />
        </Stack>

        <StyledBox title="Tag">
          <Taglist
            listContainerSx={{
              mb: 2.5,
              mt: 2,
            }}
            type="text"
            addButtonLabel="Add"
            items={currentRating?.tags || []}
            onAdd={(value) => {
              addNewBundleItem(value);
            }}
            onDelete={(item) => {
              setCurrentRating((prev) => ({ ...prev, tags: prev.tags.filter((value) => value !== item) }));
              // setCurrentRating((prev) => prev.filter((value) => value !== item));
            }}
          />
        </StyledBox>
        <Button
          disableElevation
          variant="contained"
          disabled={addNewRating?.isLoading || updateRatings?.isLoading}
          onClick={submitRatings}
        >
          {isEdit ? 'Save' : 'Add'}
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

export default AddRating;
