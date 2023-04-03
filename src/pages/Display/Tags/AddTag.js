// third party
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../helpers/successMsg';

// project import
import { ReactComponent as DownIcon } from '../../../assets/icons/down.svg';
import CloseButton from '../../../components/Common/CloseButton';
import StyledFormField from '../../../components/Form/StyledFormField';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const fieldContainerSx = {
  padding: '22px 0',
};

const types = [
  {
    label: 'Tag',
    value: 'tag',
  },
  {
    label: 'Cusine',
    value: 'cusine',
  },
];

const tagInit = {
  name: '',
  type: '',
};

// project import
export default function AddTag({ onClose, shopType, tag }) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [currentTag, setCurrentTag] = useState(tag?._id ? tag : tagInit);

  const tagsMutation = useMutation(
    (data) => {
      let API = Api.ADD_TAGS_AND_CUSINES;
      if (data?._id) {
        API = Api.UPDATE_TAGS_AND_CUSINES;
      }
      return AXIOS.post(API, {
        ...data,
      });
    },
    {
      onSuccess: (data) => {
        if (data?.status) {
          successMsg(data?.message, 'success');
          queryClient.invalidateQueries({ queryKey: ['tags-cusines'] });
          onClose();
        }
      },
    }
  );

  return (
    <Box
      sx={{
        minWidth: '400px',
        maxWidth: '400px',
        paddingLeft: '16px',
        paddingRight: '20px',
        paddingTop: '95px',
        position: 'relative',
        height: '100vh',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '19px',
            lineHeight: '23px',
          }}
        >
          Create New Tags & Cuisine
        </Typography>
        <CloseButton
          disableRipple
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
          }}
        />
      </Stack>
      <Box>
        <StyledFormField
          label="Type"
          intputType="select"
          containerProps={{
            sx: { ...fieldContainerSx, borderBottom: '0' },
          }}
          inputProps={{
            items: types,
            value: currentTag.type,
            onChange: (e) => {
              setCurrentTag((prev) => ({ ...prev, type: e.target.value }));
            },
          }}
        />
        <StyledFormField
          label="Name"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            type: 'text',
            value: currentTag.name,
            onChange: (e) => {
              setCurrentTag((prev) => ({ ...prev, name: e.target.value }));
            },
          }}
        />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '16px 20px 16px 16px',
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<DownIcon />}
          disabled={tagsMutation.isLoading}
          onClick={() => {
            if (tag?._id) {
              tagsMutation.mutate({
                ...currentTag,
                id: currentTag._id,
              });
            } else {
              tagsMutation.mutate({
                ...currentTag,
                shopType,
              });
            }
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
