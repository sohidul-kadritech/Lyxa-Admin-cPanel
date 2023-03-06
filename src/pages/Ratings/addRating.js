/* eslint-disable no-unused-vars */
// mui
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';

// thrid party
import { useEffect, useState } from 'react';

// project import
import { useDispatch, useSelector } from 'react-redux';
import OptionsSelect from '../../components/Form/OptionsSelect';
import { updateRatingIsAdded, updateRatingIsUpdated } from '../../store/ratings/ratingActions';

const faqUpperOptions = [
  { label: '★', value: '1' },
  { label: '★★', value: '2' },
  { label: '★★★', value: '3' },
  { label: '★★★★', value: '4' },
  { label: '★★★★★', value: '5' },
];

const initialCurrentRating = {
  rating: '3',
  tags: [],
};

export default function AddRatings({ submitHandler, isEdit, rating, closeHandler }) {
  const dispatch = useDispatch();
  const { loading, isAdded, isUpdated } = useSelector((store) => store.ratingReducer);

  const [currentRating, setCurrentRating] = useState(initialCurrentRating);

  const [ratingType, setRatingType] = useState('3');
  const [tag, setTag] = useState('');
  const [alltags, setAlltags] = useState([]);

  console.log(currentRating);
  console.log(rating);

  const callSubmitHandler = () => {
    submitHandler(currentRating);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      if (tag.trim() === '') {
        return;
      }
      setCurrentRating((prev) => ({ ...prev, tags: [tag, ...prev.tags] }));
      setTag('');
    }
  };

  const deleteTag = (index) => {
    const newTags = currentRating?.tags?.filter((item, i) => i !== index);
    setCurrentRating((prev) => ({ ...prev, tags: newTags }));
  };

  useEffect(() => {
    if (isAdded) {
      setTag('');
      setCurrentRating(initialCurrentRating);
      dispatch(updateRatingIsAdded(false));
    }
    if (isUpdated) {
      closeHandler();
      dispatch(updateRatingIsUpdated(false));
    }
  }, [isAdded, isUpdated]);

  useEffect(() => {
    if (rating?.tags) {
      setCurrentRating({ ...rating });
    }
  }, [rating]);

  console.log(currentRating?.rating);

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
          items={faqUpperOptions}
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
      <Button disableElevation variant="contained" disabled={loading} onClick={callSubmitHandler}>
        {isEdit ? 'Save' : 'Add New'}
      </Button>
    </Stack>
  );
}
