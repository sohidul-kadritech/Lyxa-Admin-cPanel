import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import Taglist from '../../components/Common/Taglist';
import StyledFormField from '../../components/Form/StyledFormField';
import InputBox from '../Settings/Admin/Marketing/LoyaltySettings/InputBox';
import StyledBox from '../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import IncrementDecrementButton from './IncrementDecrementButton';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '#',
  },
  {
    label: 'App Configuration',
    to: '#',
  },
];

export const maxDeliveryOptions = [
  {
    label: 'BDT',
    value: 'bdt',
  },
  {
    label: 'USD',
    value: 'usd',
  },
];

// eslint-disable-next-line no-unused-vars

function Appsettings2() {
  //   const theme = useTheme();
  const [lyxaLimit, setLyxaLimit] = useState(25);
  // Handle Incremented by one
  const incrementHandler = () => {
    setLyxaLimit((prev) => prev + 1);
  };
  // Handle decremented by one
  const decrementHandler = () => {
    setLyxaLimit((prev) => prev - 1);
  };

  return (
    <Box>
      <PageTop
        // title="Zone"
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <StyledBox title="Points earned value">
        <Stack flexDirection="row" justifyContent="space-between">
          <InputBox
            title="Maximum item price"
            //   endAdornment="$"
            inputValue="$10"
            inputType="text"
            //   onInputChange={(e) => {
            //     setGetReward((prev) => ({ ...prev, amount: e.target.value }));
            //     setGlobalChange(true);
            //   }}
          />
          <InputBox
            title="Maximum Distance"
            //   endAdornment="KM"
            inputValue="10 KM"
            inputType="text"
            //   onInputChange={(e) => {
            //     setGetReward((prev) => ({ ...prev, amount: e.target.value }));
            //     setGlobalChange(true);
            //   }}
          />
        </Stack>
      </StyledBox>
      <StyledBox title="Lyxa Pay Limit ($)">
        <IncrementDecrementButton
          incrementHandler={incrementHandler}
          decrementHandler={decrementHandler}
          currentValue={lyxaLimit}
        />
      </StyledBox>
      <StyledBox title="VAT (Percentage)">
        <IncrementDecrementButton
          incrementHandler={incrementHandler}
          decrementHandler={decrementHandler}
          currentValue={lyxaLimit}
        />
      </StyledBox>
      <StyledBox title="Delivery Boy Search Area (KM)">
        <Taglist
          listContainerSx={{
            mb: 2.5,
            mt: 2,
          }}
          addButtonLabel="Add"
          items={['10', '100']}
          // onAdd={(value) => addNewBundleItem(value)}
          // onDelete={(item, index, array) => {
          //   array.splice(index, 1);
          //   setRender((prev) => !prev);
          //   setGlobalChange(true);
          // }}
        />
      </StyledBox>
      <StyledBox title="Near Shop Distance (KM)">
        <Taglist
          listContainerSx={{
            mb: 2.5,
            mt: 2,
          }}
          addButtonLabel="Add"
          items={['100', '200']}
          // onAdd={(value) => addNewBundleItem(value)}
          // onDelete={(item, index, array) => {
          //   array.splice(index, 1);
          //   setRender((prev) => !prev);
          //   setGlobalChange(true);
          // }}
        />
      </StyledBox>
      <StyledBox title="Maximum Discount for Shops ($)">
        <Taglist
          listContainerSx={{
            mb: 2.5,
            mt: 2,
          }}
          addButtonLabel="Add"
          items={['100', '150']}
          // onAdd={(value) => addNewBundleItem(value)}
          // onDelete={(item, index, array) => {
          //   array.splice(index, 1);
          //   setRender((prev) => !prev);
          //   setGlobalChange(true);
          // }}
        />
      </StyledBox>
      <StyledBox title="App Currency">
        <StyledFormField
          intputType="select"
          containerProps={{
            sx: {
              width: '125px',
            },
          }}
          inputProps={{
            name: 'shopStatus',
            placeholder: 'currency',
            // value: props?.value,
            items: maxDeliveryOptions,
            //   items: categories,
            // onChange: (e) => props.action(e.target.value),
            //   readOnly: Boolean(newProductCategory) || productReadonly,
          }}
        />
      </StyledBox>

      <Stack
        direction="row"
        justifyContent="flex-end"
        gap={4}
        sx={{
          mt: 9,
          pb: 12,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          //   onClick={() => {
          //     if (has_unsaved_change) {
          //       setIsConfirmModalOpen(true);
          //     }
          //   }}
        >
          Discard
        </Button>
        <Button
          // onClick={updateData.mutate}
          variant="contained"
          color="primary"
          //   disabled={updateData.isLoading}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}

export default Appsettings2;
