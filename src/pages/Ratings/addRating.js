// mui
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';

// thrid party
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

// project import
import OptionsSelect from '../../components/Form/OptionsSelect';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

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

const initRating = {
  rating: '4',
  tags: [],
  type: 'shop',
};

export default function AddRatings({ isEdit, rating, closeHandler }) {
  const queryClient = useQueryClient();

  const [currentRating, setCurrentRating] = useState({ ...initRating });
  const [tag, setTag] = useState('');

  // add new rating
  const addNewRating = useMutation((ratings) => AXIOS.post(Api.ADD_NEW_RATING, ratings), {
    onSuccess: (data) => {
      if (data?.status) {
        closeHandler();
        queryClient.invalidateQueries({ queryKey: ['ratting_settings'] });
      } else {
        successMsg(data?.message, 'warn');
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateRatings = useMutation((ratings) => AXIOS.post(Api.UPDATE_RATING, ratings), {
    onSuccess: (data) => {
      if (data?.status) {
        closeHandler();
        queryClient.invalidateQueries({ queryKey: ['ratting_settings'] });
      } else {
        successMsg(data?.message, 'warn');
      }
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
    if (rating?._id) {
      setCurrentRating({ ...rating });
    }
  }, [rating]);

  return (
    <Stack spacing={6}>
      <Stack
        direction="row"
        spacing={5}
        sx={{
          alignItems: {
            xl: 'center',
            lg: 'start',
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            flexShrink: 0,
            marginTop: {
              xl: '0px',
              lg: '6px',
            },
          }}
        >
          Type
        </Typography>
        <OptionsSelect
          items={ratingTypes}
          value={`${currentRating?.type}`}
          hideOnDisabled
          disabled={isEdit}
          onChange={(value) => {
            setCurrentRating((prev) => ({ ...prev, type: value }));
          }}
          sx={{
            '& .MuiChip-label': {
              fontSize: '15px',
            },
          }}
        />
      </Stack>
      <OptionsSelect
        items={ratingOptions}
        value={`${currentRating?.rating}`}
        hideOnDisabled
        disabled={isEdit}
        onChange={(value) => {
          setCurrentRating((prev) => ({ ...prev, rating: value }));
        }}
        sx={{
          '& .MuiChip-label': {
            fontSize: '15px',
          },
        }}
      />
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
          variant="h5"
          sx={{
            flexShrink: 0,
            marginTop: {
              xl: '0px',
              lg: '6px',
            },
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
      <Button disableElevation variant="contained" disabled={addNewRating.isLoading} onClick={submitRatings}>
        {isEdit ? 'Save' : 'Add New'}
      </Button>
    </Stack>
  );
}
