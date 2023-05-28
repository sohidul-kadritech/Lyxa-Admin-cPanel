import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

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
// eslint-disable-next-line no-unused-vars
function AddRating({ onClose, submitHandler, isEdit, rating, loading, refetchFlags }) {
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line no-unused-vars
  const [faqType, setFaqType] = useState('');
  const queryClient = useQueryClient();

  const [currentRating, setCurrentRating] = useState({ ...initRating });

  const [tag, setTag] = useState('');

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

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      if (tag.trim() === '') {
        return;
      }
      setCurrentRating((prev) => ({ ...prev, tags: [tag.trim(), ...prev.tags] }));
      setTag('');
    }
  };

  const deleteTag = (index) => {
    const newTags = currentRating?.tags?.filter((item, i) => i !== index);
    setCurrentRating((prev) => ({ ...prev, tags: newTags }));
  };

  useEffect(() => {
    setCurrentRating({ ...rating });
  }, [rating]);

  return (
    <SidebarContainer title={`${isEdit === false ? 'Add New Rating' : 'Edit Rating'}`} onClose={onClose}>
      <Stack spacing={6}>
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

        <TextField
          label="Tag"
          placeholder="Press 'Enter' to add"
          name="tag"
          variant="outlined"
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
          }}
          onKeyUp={handleAddTag}
          sx={{
            width: '100%',
          }}
        />
        <Stack spacing={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '18px',
            }}
          >
            New Tags
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              background: 'rgba(0, 0, 0, 0.08)',
              minHeight: '80px',
              padding: 2,
              borderRadius: 2,
            }}
          >
            {currentRating?.tags?.length === 0 && (
              <Typography
                textAlign="center"
                variant="body3"
                sx={{
                  flexShrink: 0,
                  marginTop: {
                    xl: '0px',
                    lg: '6px',
                  },
                }}
              >
                Empty
              </Typography>
            )}
            {currentRating?.tags?.map((item, index) => (
              <Chip
                key={index}
                label={item}
                color="info"
                variant="contained"
                onDelete={() => {
                  deleteTag(index);
                }}
              />
            ))}
          </Box>
        </Stack>
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
