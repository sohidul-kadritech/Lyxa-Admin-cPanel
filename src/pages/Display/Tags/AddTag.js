// third party
import { Box, Button, Stack } from '@mui/material';
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
  type: 'tag',
};

const uploadImage = async (image) => {
  const fdata = new FormData();
  fdata.append('image', image);

  try {
    const { data } = await AXIOS.post(Api.IMAGE_UPLOAD, fdata);
    return data;
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: error?.message,
    };
  }
};

const getTagInit = (shopType, tag) => {
  if (shopType === 'food' && tag?._id) return { ...tag, image: [{ preview: tag.image }] };
  if (shopType === 'food' && !tag?._id) return { ...tagInit, image: [] };
  if (shopType !== 'food' && tag?._id) return { ...tag };
  if (shopType !== 'food' && !tag?._id) return { ...tagInit };
  return {};
};

// project import
export default function AddTag({ onClose, shopType, tag }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [currentTag, setCurrentTag] = useState(getTagInit(shopType, tag));

  const tagsMutation = useMutation(
    (data) => {
      let API = Api.ADD_TAGS_AND_CUSINES;
      if (data?._id) {
        API = Api.UPDATE_TAGS_AND_CUSINES;
      }

      const fdata = tag?._id ? { ...data, id: tag?._id } : data;
      return AXIOS.post(API, fdata);
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

  // image
  const onDrop = (acceptedFiles) => {
    setCurrentTag((prev) => ({
      ...prev,
      image: acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    }));
  };

  // update tag
  const updateTag = async () => {
    if (!currentTag?.name?.trim()) {
      successMsg('Name cannot be empty!');
      return;
    }

    if (shopType === 'food' && currentTag.image?.length === 0) {
      successMsg('Image is required for food type');
      return;
    }

    if (shopType === 'food' && !currentTag.type) {
      successMsg('Type cannot be empty');
      return;
    }

    if (shopType === 'food') {
      const data = { ...currentTag };
      data.type = currentTag.type;
      data.shopType = shopType;

      let imageData;

      if (currentTag.image[0]?.name) {
        setLoading(true);
        imageData = await uploadImage(currentTag.image[0]);

        if (imageData.status === false) {
          successMsg(imageData.message, 'error');
          return;
        }

        setLoading(false);
      } else {
        imageData = { url: currentTag.image[0]?.preview };
      }

      data.image = imageData?.url;

      tagsMutation.mutate(data);
    } else if (tag?._id) {
      tagsMutation.mutate(currentTag);
    } else {
      tagsMutation.mutate({
        ...currentTag,
        shopType,
      });
    }
  };

  return (
    <SidebarContainer title={tag?._id ? 'Edit Tags & Cuisine' : 'Create New Tags & Cuisine'} onClose={onClose}>
      <Stack justifyContent="space-between" height="100%">
        <Box>
          {shopType !== 'food' || !!currentTag?._id ? (
            <StyledFormField
              label="Type"
              intputType="text"
              containerProps={{
                sx: fieldContainerSx,
              }}
              inputProps={{
                readOnly: true,
                type: 'text',
                value: currentTag.type === 'tag' ? 'Tag' : 'Cuisine',
              }}
            />
          ) : (
            <StyledFormField
              label="Type"
              intputType="select"
              containerProps={{
                sx: { ...fieldContainerSx, borderBottom: '0' },
              }}
              inputProps={{
                items: types,
                inputProps: { readOnly: shopType !== 'food' || !!currentTag?._id },
                value: currentTag.type,
                onChange: (e) => {
                  setCurrentTag((prev) => ({ ...prev, type: e.target.value }));
                },
              }}
            />
          )}
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
          {shopType === 'food' && (
            <StyledFormField
              label="Photo"
              intputType="file"
              containerProps={{
                sx: fieldContainerSx,
              }}
              inputProps={{
                onDrop,
                accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
                maxSize: 1000 * 1000 * 2,
                text: 'Drag and drop or chose photo',
                files: currentTag.image,
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            paddingTop: '80px',
            paddingBottom: '16px',
          }}
        >
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<DropIcon />}
            disabled={tagsMutation.isLoading || loading}
            onClick={() => {
              updateTag();
            }}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </SidebarContainer>
  );
}
