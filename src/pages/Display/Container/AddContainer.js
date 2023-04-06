// third party
import { Box, Button, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledChip from '../../../components/Styled/StyledChips';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const fieldContainerSx = {
  padding: '22px 0',
  borderBottom: '1px solid #EEEEEE',
};

const selectProps = {
  multiple: true,
  disablePortal: false,
  getOptionLabel: (option) => option?.name || 'None',
  label: 'None',
  sx: {
    '& .MuiFormControl-root': {
      minWidth: '100px',
    },
  },
};

const containerInit = {
  name: '',
  // image: [],
  type: [],
  deals: [],
  tags: [],
  shops: [],
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

// project import
export default function AddContainer({ onClose, shopType, editContainer, containerType }) {
  let itemAddApi = Api.ADD_LIST_CONTAINERS;
  let itemEditApi = Api.UPDATE_LIST_CONTAINERS;
  let itemsQueryKey = `list-container-${shopType}`;

  if (containerType === 'filter') {
    itemAddApi = Api.ADD_FILTER_CONTAINERS;
    itemEditApi = Api.UPDATE_FILTER_CONTAINERS;
    itemsQueryKey = `filter-container-${shopType}`;
  }

  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [container, setContainer] = useState(
    containerType === 'list' ? { ...containerInit, image: [] } : containerInit
  );

  // image
  const onDrop = (acceptedFiles) => {
    setContainer((prev) => ({
      ...prev,
      image: acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    }));
  };

  // get deals
  const dealSettingsQuery = useQuery(['deal-settings', { type: shopType }], () =>
    AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS, {
      params: {
        type: shopType === 'food' ? 'restaurant' : shopType,
      },
    })
  );

  const dealsOptions = useMemo(() => {
    const percentageDeals = dealSettingsQuery?.data?.data?.dealSetting?.length
      ? dealSettingsQuery?.data?.data?.dealSetting[0]?.percentageBundle
      : [];

    const shopTypeDeals = dealSettingsQuery?.data?.data?.dealSetting?.length
      ? dealSettingsQuery?.data?.data?.dealSetting[0]?.option
      : [];

    const dealOptions = percentageDeals.map((item) => ({ value: item, name: item.toString() }));

    if (shopTypeDeals.includes('double_menu')) {
      dealOptions.push({
        name: 'Double Menu',
        value: 'double_menu',
      });
    }

    return dealOptions;
  }, [dealSettingsQuery.status]);

  // get tags
  const tagsQuery = useQuery([`tags-cusines-${shopType}`], () =>
    AXIOS.get(Api.GET_ALL_TAGS_AND_CUSINES, {
      params: {
        page: 1,
        pageSize: 500,
        shopType,
      },
    })
  );

  const tagsOptions = tagsQuery?.data?.data?.tags?.filter((item) => item.type === 'tag') || [];

  // shops query
  const shopsQuery = useQuery(['all-shops', { type: shopType }], () =>
    AXIOS.get(Api.ALL_SHOP, {
      params: {
        type: shopType,
      },
    })
  );

  const shopsOptions = shopsQuery?.data?.data?.shops || [];

  // add container
  const listMutation = useMutation(
    (data) => {
      let api = itemAddApi;
      if (editContainer?._id) {
        api = itemEditApi;
      }
      return AXIOS.post(api, data);
    },
    {
      onSuccess: (data) => {
        if (data?.status) {
          successMsg(data.message, 'success');
          onClose();
          queryClient.invalidateQueries([itemsQueryKey]);
        } else {
          successMsg(data.message, 'error');
        }
      },
    }
  );

  // update container
  const updateContainer = async () => {
    if (!container?.name?.trim()) {
      successMsg('Name cannot be empty!');
      return;
    }

    if (containerType === 'list' && container?.image?.length < 1) {
      successMsg('Image is required!');
      return;
    }

    const type = {
      deal: false,
      tag: false,
      shop: false,
    };

    const data = {};
    data.name = container.name;

    data.deals = container.deals.map((item) => {
      type.deal = true;
      return item.value;
    });

    data.tags = container.tags.map((item) => {
      type.tag = true;
      return item._id;
    });

    data.shops = container.shops.map((item) => {
      type.shop = true;
      return item._id;
    });

    data.type = Object.entries(type)
      .filter((item) => item[1])
      .map((item) => item[0]);

    // validation
    if (data?.type.length === 0) {
      successMsg(
        containerType === 'list' ? 'Please select atleast one of Deal, Shop or Tag!' : 'Please select deals first'
      );
      return;
    }

    data.shopType = shopType;

    if (containerType === 'list') {
      let imageData;

      if (container.image[0]?.name) {
        setLoading(true);
        imageData = await uploadImage(container.image[0]);

        if (imageData.status === false) {
          successMsg(imageData.message, 'error');
          return;
        }
        setLoading(false);
      } else {
        imageData = { url: container.image[0].preview };
      }

      data.image = imageData?.url;
    }

    if (editContainer?._id) {
      data.id = editContainer?._id;
    }

    listMutation.mutate(data);
  };

  const convertToProperData = (container) => {
    const newData = {};
    newData.name = container?.name;
    newData.type = [...(container.type || [])];
    newData.deals = container?.deals?.map((item) => {
      if (item === 'double_menu') {
        return {
          name: 'Double Menu',
          value: 'double_menu',
        };
      }
      return { value: item, name: item.toString() };
    });

    if (containerType === 'list') {
      newData.image = [{ preview: container?.image }];
    }

    newData.tags = tagsOptions.filter((item) => container?.tags?.includes(item?._id));
    newData.shops = shopsOptions.filter((item) => container?.shops?.includes(item?._id));
    setContainer(newData);
  };

  const G_LOADING = dealSettingsQuery.isLoading || tagsQuery.isLoading || shopsQuery.isLoading;

  useEffect(() => {
    if (!shopsQuery.isLoading && !tagsQuery.isLoading && !dealSettingsQuery.isLoading && editContainer?._id) {
      convertToProperData(editContainer);
    }
  }, [dealSettingsQuery.isLoading, tagsQuery.isLoading, shopsQuery.isLoading]);

  return (
    <SidebarContainer onClose={onClose} title={editContainer?._id ? 'Edit Container' : 'Create New Container'}>
      <Stack justifyContent="space-between" height="100%">
        <Box>
          <StyledFormField
            label="Name"
            intputType="text"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              type: 'text',
              disabled: G_LOADING,
              value: container.name,
              onChange: (e) => {
                setContainer((prev) => ({ ...prev, name: e.target.value }));
              },
            }}
          />
          {containerType === 'list' && (
            <StyledFormField
              label="Photo"
              intputType="file"
              containerProps={{
                sx: fieldContainerSx,
              }}
              inputProps={{
                disabled: G_LOADING,
                onDrop,
                accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
                maxSize: 1000 * 1000,
                text: 'Drag and drop or chose photo',
                files: container.image,
              }}
            />
          )}
          {/* deals */}
          <StyledFormField
            label="Deals"
            intputType="autocomplete"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              ...selectProps,
              disabled: G_LOADING,
              // open: true,
              options: dealsOptions,
              value: container.deals,
              maxHeight: '200px',
              // eslint-disable-next-line eqeqeq
              isOptionEqualToValue: (option, value) => option.value == value.value,
              onChange: (e, v) => {
                setContainer((prev) => ({ ...prev, deals: v.map((item) => item) }));
              },
              renderTags: (item, index) => (
                <StyledChip
                  key={item?.value}
                  label={item?.name}
                  size="lg"
                  onDelete={() => {
                    setContainer((prev) => {
                      const { deals } = prev;
                      return { ...prev, deals: deals.filter((item, idx) => idx !== index) };
                    });
                  }}
                />
              ),
            }}
          />
          {/* tags */}
          {containerType === 'list' && (
            <StyledFormField
              label="Tags"
              intputType="autocomplete"
              containerProps={{
                sx: fieldContainerSx,
              }}
              inputProps={{
                ...selectProps,
                maxHeight: '200px',
                disabled: G_LOADING,
                options: tagsOptions,
                value: container.tags,
                isOptionEqualToValue: (option, value) => option?._id === value?._id,
                onChange: (e, v) => {
                  setContainer((prev) => ({ ...prev, tags: v.map((item) => item) }));
                },
              }}
            />
          )}
          {/* restaurants */}
          {containerType === 'list' && (
            <StyledFormField
              label={shopType === 'food' ? 'Restaurant' : 'Shop'}
              intputType="autocomplete"
              containerProps={{
                sx: { ...fieldContainerSx, borderBottom: '0' },
              }}
              inputProps={{
                ...selectProps,
                maxHeight: '110px',
                disabled: G_LOADING,
                options: shopsOptions,
                value: container.shops,
                isOptionEqualToValue: (option, value) => option?._id === value?._id,
                getOptionLabel: (option) => option?.shopName,
                onChange: (e, v) => {
                  setContainer((prev) => ({ ...prev, shops: v.map((item) => item) }));
                },
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            paddingTop: '120px',
            paddingBottom: '16px',
          }}
        >
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<DropIcon />}
            disabled={listMutation.isLoading || loading}
            onClick={updateContainer}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </SidebarContainer>
  );
}
