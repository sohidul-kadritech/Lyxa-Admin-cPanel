/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { dietryOptions } from '../../../pages/Menu/helpers';
import IncrementDecrementInput from '../../Form/IncrementDecrementInput';
import StyledFormField from '../../Form/StyledFormField';
import StyledSwitch from '../../Styled/StyledSwitch';
import OpenDays from './OpenDays';
import { deliveryOptions, paymentOptions, priceRangeOptions } from './helper';

const filterTagsAndCuisine = (tagsCuisine) => {
  const tagsOptions = [];
  const cuisinesOptions = [];

  tagsCuisine?.forEach((tag) => {
    if (tag?.type === 'tag') tagsOptions.push(tag);
    else cuisinesOptions.push(tag);
  });

  return { tagsOptions, cuisinesOptions };
};

export default function ShopFeatures({ shop, onChange, tagsCuisine = [], sellerType }) {
  const [render, setRender] = useState();

  const optionSelectHandler = (value, item) => {
    const idx = value?.indexOf(item);

    if (idx === -1) {
      value?.push(item);
    } else {
      value?.splice(idx, 1);
    }

    setRender(!render);
  };

  const { tagsOptions, cuisinesOptions } = useMemo(() => filterTagsAndCuisine(tagsCuisine), [tagsCuisine]);

  console.log(shop);

  return (
    <Box>
      {/* price range */}
      <StyledFormField
        intputType="optionsSelect"
        label="Price Range"
        inputProps={{
          value: shop?.expensive,
          onChange: (value) => {
            shop.expensive = value;
            setRender(!render);
          },
          items: priceRangeOptions,
        }}
      />
      {/* delivery method */}
      <StyledFormField
        intputType="optionsSelect"
        label="Delivery Method"
        inputProps={{
          value: shop?.deliveryType,
          onChange: (value) => {
            shop.deliveryType = value;
            setRender(!render);
          },
          items: deliveryOptions,
        }}
      />
      {/* delivery fee  */}
      {shop?.deliveryType === 'self' && (
        <StyledFormField
          label="Delivery Fee"
          intputType="text"
          inputProps={{
            value: shop?.deliveryFee,
            type: 'text',
            name: 'deliveryFee',
            onChange,
          }}
        />
      )}
      {/* opening hours  */}
      <Stack gap={2} pt={3} pb={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h5"
            sx={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '18px',
            }}
          >
            Opening Hours
          </Typography>
          <Typography variant="body4" color="#7E8299">
            12:00 to 23:00
          </Typography>
        </Stack>
        <OpenDays days={shop?.normalHours} />
        <Typography variant="body4" color="#7E8299">
          You can adjust opening hours from shop admin after creation
        </Typography>
      </Stack>
      {/* minimum order  */}
      <Stack gap={2} pt={3} pb={3}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: '600',
            fontSize: '15px',
            lineHeight: '18px',
          }}
        >
          Minimum Order
        </Typography>
        <IncrementDecrementInput
          value={shop?.minOrderAmount}
          min={1}
          onChange={(value) => {
            shop.minOrderAmount = value;
            setRender(!render);
          }}
        />
      </Stack>
      {/* order capacity */}
      <Stack gap={2} pt={3} pb={3}>
        <Stack justifyContent="space-between" alignItems="center" direction="row" pb={1}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '18px',
            }}
          >
            Order Capacity
          </Typography>
          <StyledSwitch
            checked={shop?.orderCapacity > 0}
            onChange={(e) => {
              shop.orderCapacity = e.target.checked ? 1 : 0;
              setRender(!render);
            }}
          />
        </Stack>
        {shop?.orderCapacity > 0 && (
          <IncrementDecrementInput
            value={shop?.orderCapacity}
            min={1}
            onChange={(value) => {
              shop.orderCapacity = value;
              setRender(!render);
            }}
          />
        )}
      </Stack>
      {/* payment method */}
      <StyledFormField
        intputType="optionsSelect"
        label="Payment Type"
        inputProps={{
          value: shop?.paymentOption,
          multiple: true,
          onChange: (value) => {
            optionSelectHandler(shop?.paymentOption, value);
          },
          items: paymentOptions,
        }}
      />
      {/* tags */}
      <StyledFormField
        label="Tags"
        intputType="autocomplete"
        inputProps={{
          multiple: true,
          getOptionLabel: (option) => option?.name || 'Choose',
          label: 'Choose',
          sx: {
            '& .MuiFormControl-root': {
              minWidth: '100px',
            },
          },
          maxHeight: '200px',
          options: tagsOptions,
          value: shop.tags,
          isOptionEqualToValue: (option, value) => option?._id === value?._id,
          onChange: (e, v) => {
            shop.tags = v.map((item) => item);
            setRender(!render);
          },
        }}
      />
      {/* cuisine */}
      {sellerType === 'food' && (
        <StyledFormField
          label="Cuisine"
          intputType="autocomplete"
          inputProps={{
            multiple: true,
            getOptionLabel: (option) => option?.name || 'Choose',
            label: 'Choose',
            sx: {
              '& .MuiFormControl-root': {
                minWidth: '100px',
              },
            },
            maxHeight: '200px',
            options: cuisinesOptions,
            value: shop.cuisineType,
            isOptionEqualToValue: (option, value) => option?._id === value?._id,
            onChange: (e, v) => {
              shop.cuisineType = v.map((item) => item);
              setRender(!render);
            },
          }}
        />
      )}
      {/* dietary */}
      {sellerType !== 'pharmacy' && (
        <StyledFormField
          intputType="optionsSelect"
          label="Dietary"
          inputProps={{
            value: shop?.dietaryType,
            multiple: true,
            onChange: (value) => {
              optionSelectHandler(shop?.dietaryType, value);
            },
            items: dietryOptions,
          }}
        />
      )}
      {/* note */}
      <StyledFormField
        label={
          <span>
            Notes
            <span
              style={{
                color: '#7E8299',
              }}
            >
              {' '}
              (only visible to you)
            </span>
          </span>
        }
        intputType="textarea"
        inputProps={{
          name: 'shopNote',
          value: shop?.shopNote,
          onChange,
          multiline: true,
        }}
      />
    </Box>
  );
}
