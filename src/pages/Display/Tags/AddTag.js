// third party
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../helpers/successMsg';

// project import
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
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
    label: 'Cuisine',
    value: 'cuisine',
  },
];

const tagInit = {
  name: '',
  type: '',
};

// project import
export default function AddTag({ onClose, shopType, tag }) {
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
          queryClient.invalidateQueries({ queryKey: [`tags-cusines-${shopType}`] });
          onClose();
        }
      },
    }
  );

  return (
    <SidebarContainer title="Create New Tags & Cuisine" onClose={onClose}>
      <>
        <Box>
          <StyledFormField
            label="Type"
            intputType="select"
            containerProps={{
              sx: { ...fieldContainerSx, borderBottom: '0' },
            }}
            inputProps={{
              items: types,
              inputProps: { readOnly: shopType !== 'food' || !!currentTag?._id },
              value: shopType === 'food' ? currentTag.type : 'tag',
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
            startIcon={<DropIcon />}
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
                  type: shopType === 'food' ? currentTag.type : 'tag',
                });
              }
            }}
          >
            Save
          </Button>
        </Box>
      </>
    </SidebarContainer>
  );
}
