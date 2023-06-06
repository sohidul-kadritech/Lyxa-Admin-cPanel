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
import AddContainerSkeleton from './AddContainerSkeleton';
import { createContainerData } from './helper';

const fieldContainerSx = {
  padding: '22px 0',
  borderBottom: '1px solid #EEEEEE',
};

const selectProps = {
  multiple: true,
  getOptionLabel: (option) => option?.name || 'Choose',
  label: 'Choose',
  sx: {
    '& .MuiFormControl-root': {
      minWidth: '100px',
    },
  },
};

const containerInit = {
  name: '',
  type: [],
  deals: [],
  tags: [],
  shops: [],
};

export default function AddContainer({ onClose, shopType, editContainer, containerType }) {
  let itemAddApi = Api.ADD_LIST_CONTAINERS;
  let itemEditApi = Api.UPDATE_LIST_CONTAINERS;
  let itemsQueryKey = `list-container-${shopType}`;

  // switch keys
  if (containerType === 'filter') {
    itemAddApi = Api.ADD_FILTER_CONTAINERS;
    itemEditApi = Api.UPDATE_FILTER_CONTAINERS;
    itemsQueryKey = `filter-container-${shopType}`;
  }

  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [container, setContainer] = useState(
    containerType === 'list' ? { ...containerInit, image: [], banner: [] } : containerInit
  );

  // image
  const onDrop = (acceptedFiles, rejectedFiles, dontKnow, fieldName) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
      })
    );

    setContainer((prev) => ({
      ...prev,
      [fieldName]: newFiles?.length > 0 ? newFiles : prev[fieldName],
    }));
  };

  // get deals
  const dealSettingsQuery = useQuery(['deal-settings', { type: shopType }], () =>
    AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS, {
      params: {
        type: shopType === 'food' ? 'restaurant' : shopType,
      },
      // eslint-disable-next-line prettier/prettier
    })
  );

  const dealsOptions = useMemo(() => {
    const percentageDeals = dealSettingsQuery?.data?.data?.dealSetting?.length
      ? dealSettingsQuery?.data?.data?.dealSetting[0]?.percentageBundle
      : [];

    const shopTypeDeals = dealSettingsQuery?.data?.data?.dealSetting?.length
      ? dealSettingsQuery?.data?.data?.dealSetting[0]?.option
      : [];

    const dealOptions = percentageDeals.map((item) => ({ value: item, name: `${item.toString()}%` }));

    // double menu
    if (shopTypeDeals.includes('double_menu')) {
      dealOptions.push({
        name: 'Buy 1 Get 1',
        value: 'double_menu',
      });
    }

    // free delivery
    if (shopTypeDeals.includes('free_delivery')) {
      dealOptions.push({
        name: 'Free Delivery',
        value: 'free_delivery',
      });
    }

    console.log({ shopTypeDeals });

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
    setLoading(true);
    const containerData = await createContainerData(container, containerType, shopType);
    setLoading(false);

    if (containerData === null) {
      return;
    }

    if (editContainer?._id) {
      containerData.id = editContainer?._id;
    }

    listMutation.mutate(containerData);
  };

  // covert to proper format
  const convertToProperData = (container) => {
    const newData = {};
    newData.name = container?.name;
    newData.type = [...(container.type || [])];
    newData.deals = container?.deals?.map((item) => {
      if (item === 'double_menu')
        return {
          name: 'Buy 1 Get 1',
          value: 'double_menu',
        };

      if (item === 'free_delivery')
        return {
          name: 'Free Delivery',
          value: 'free_delivery',
        };

      return { value: item, name: `${item.toString()}%` };
    });

    if (containerType === 'list') {
      newData.image = [{ preview: container?.image }];
      newData.banner = [{ preview: container?.banner }];
    }

    newData.tags = tagsOptions.filter((item) => container?.tags?.includes(item?._id));
    newData.shops = shopsOptions.filter((item) => container?.shops?.includes(item?._id));
    setContainer(newData);
  };

  // global loading flag
  const __loading = dealSettingsQuery.isLoading || tagsQuery.isLoading || shopsQuery.isLoading;

  useEffect(() => {
    if (!shopsQuery.isLoading && !tagsQuery.isLoading && !dealSettingsQuery.isLoading && editContainer?._id) {
      convertToProperData(editContainer);
    }
  }, [dealSettingsQuery.isLoading, tagsQuery.isLoading, shopsQuery.isLoading]);

  return (
    <SidebarContainer onClose={onClose} title={editContainer?._id ? 'Edit Container' : 'Create New Container'}>
      {__loading ? (
        <AddContainerSkeleton containerType={containerType} />
      ) : (
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
                disabled: __loading,
                value: container.name,
                onChange: (e) => {
                  setContainer((prev) => ({ ...prev, name: e.target.value }));
                },
              }}
            />
            {/* photo */}
            {containerType === 'list' && (
              <StyledFormField
                label="Container Image"
                intputType="file"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  disabled: __loading,
                  onDrop: (...props) => {
                    onDrop(...props, 'image');
                  },
                  maxSize: 1000 * 1000,
                  text: 'Drag and drop or chose photo',
                  files: container.image,
                }}
              />
            )}
            {/* banner */}
            {containerType === 'list' && (
              <StyledFormField
                label="Banner Image"
                intputType="file"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  disabled: __loading,
                  onDrop: (...props) => {
                    onDrop(...props, 'banner');
                  },
                  maxSize: 1000 * 1000,
                  text: 'Drag and drop or chose photo',
                  files: container.banner,
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
                disabled: __loading,
                options: dealsOptions,
                value: container.deals,
                maxHeight: '200px',
                disablePortal: true,
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
                  disabled: __loading,
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
                  disabled: __loading,
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
              color="primary"
              startIcon={<DropIcon />}
              disabled={listMutation.isLoading || loading}
              onClick={updateContainer}
            >
              Save
            </Button>
          </Box>
        </Stack>
      )}
    </SidebarContainer>
  );
}
