// third party
import { Box, Button, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
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
  isOptionEqualToValue: (option, value) => option?._id === value?._id,
  label: 'None',
  sx: {
    '& .MuiFormControl-root': {
      minWidth: '100px',
    },
  },
};

const containerInit = {
  name: '',
  image: [],
  type: [],
  deals: [],
  tags: [],
  shops: [],
};

// eslint-disable-next-line no-unused-vars
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
export default function AddContainer({ onClose, shopType, editContainer }) {
  const [container, setContainer] = useState(containerInit);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

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
        type: shopType,
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
      let api = Api.ADD_LIST_CONTAINERS;
      if (editContainer?._id) {
        api = Api.UPDATE_LIST_CONTAINERS;
      }
      return AXIOS.post(api, data);
    },
    {
      onSuccess: (data) => {
        console.log(data);
        if (data?.status) {
          successMsg(data.message, 'success');
          onClose();
        }
      },
    }
  );

  // update container
  const updateContainer = async () => {
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
      type.tags = true;
      return item._id;
    });

    data.shops = container.shops.map((item) => {
      type.shop = true;
      return item._id;
    });

    data.types = Object.entries(type)
      .filter((item) => item[1])
      .map((item) => item[0]);

    data.shopType = shopType;

    setLoading(true);
    const imageData = await uploadImage(container.image[0]);

    if (imageData.status === false) {
      successMsg(imageData.message, 'error');
      return;
    }
    setLoading(false);

    data.image = imageData?.url;

    listMutation.mutate(data);
  };

  return (
    <SidebarContainer onClose={onClose} title="Create New Container">
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
              value: container.name,
              onChange: (e) => {
                setContainer((prev) => ({ ...prev, name: e.target.value }));
              },
            }}
          />
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
              files: container.image,
            }}
          />
          {/* deals */}
          <StyledFormField
            label="Deals"
            intputType="autocomplete"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              ...selectProps,
              options: dealsOptions,
              value: container.deals,
              maxHeight: '200px',
              isOptionEqualToValue: (option, value) => option.value === value.value,
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
          <StyledFormField
            label="Tags"
            intputType="autocomplete"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              ...selectProps,
              // open: true,
              maxHeight: '200px',
              options: tagsOptions,
              value: container.tags,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              onChange: (e, v) => {
                setContainer((prev) => ({ ...prev, tags: v.map((item) => item) }));
              },
            }}
          />
          {/* restaurants */}
          <StyledFormField
            label="Restaurant"
            intputType="autocomplete"
            containerProps={{
              sx: { ...fieldContainerSx, borderBottom: '0' },
            }}
            inputProps={{
              ...selectProps,
              maxHeight: '110px',
              options: shopsOptions,
              value: container.shops,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              getOptionLabel: (option) => option?.shopName,
              onChange: (e, v) => {
                setContainer((prev) => ({ ...prev, shops: v.map((item) => item) }));
              },
            }}
          />
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
