import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
// import { EDIT_SHOP } from '../../../network/Api';
import { Button, Divider, Stack } from '@mui/material';
// import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import PageTop from '../../../components/Common/PageTop';
import { deepClone } from '../../../helpers/deepClone';
import MinimumOrder from './MinimumOrder/MinimumOrder';
import { ShopSettingsSection2 } from './ShopSettingsSection/ShopSettingsSection2';
import { General as ShopSettingsSection } from './ShopSettingsSection/index';

// data

import { DeliverySettings, DietarySettings, PaymentInformationList, PriceRange } from './Helper/helper';

function ShopSettings() {
  const shop = useSelector((store) => store.Login.admin);
  console.log('shop', shop);

  const [newShop, setNewShop] = useState(deepClone(shop));
  console.log('shop', newShop);
  const [newPayMentInformation, setNewPaymentInformation] = useState(newShop?.paymentOption);
  const [newPriceRange, setNewPriceRange] = useState(newShop?.expensive);
  const [newDietary, setNewDietary] = useState(newShop?.dietary);
  const [minimumOrder, setMinimumOrder] = useState(newShop?.minOrderAmount);
  const [OwnDeliveryBoy, setOwnDeliveryBoy] = useState(newShop?.haveOwnDeliveryBoy);
  // const queryClient = useQueryClient();
  const updateShopSettings = () => {
    const oldShop = newShop;
    oldShop.shopAddress = newShop.address;
    const dataBody = {
      _id: newShop?._id,
      paymentOption: newPayMentInformation,
      expensive: newPriceRange,
      dietary: newDietary,
      haveOwnDeliveryBoy: OwnDeliveryBoy,
      minOrderAmount: minimumOrder,
      shopAddress: newShop.address,
      ...newShop,
    };

    console.log('body ; ', dataBody);

    // Axios.post(Api.EDIT_SHOP, dataBody).then((res) => console.log(res));
  };

  // const [updateData] = useMutation(updateShopSettings);

  // console.log(isSuccess);
  // console.log(isLoading);
  // console.log(isError);
  const actionHandler = (isActive, title) => {
    const oldShop = newShop;
    const index = oldShop.paymentOption.indexOf(title.toLowerCase());

    if (index !== -1) oldShop.paymentOption.splice(index, 1); // remove 1 element at index
    else oldShop.paymentOption.push(title.toLowerCase());

    console.log('old shop', oldShop.paymentOption);
    setNewShop(oldShop);
    console.log(isActive);

    return !isActive;
  };

  const buttonListGeneral = [
    {
      actionTitle: 'Allow customers to add special instructions to individual items',
      action: actionHandler,
      isChecked: true,
    },
  ];

  const boxSx = {
    padding: '0px 56px 0px 30px',
    width: '100%',
    color: '#000',
    backgroundColor: '#ffffff',
    borderRadius: '7px',
    marginBottom: '22px',
  };

  const TypoSx = {
    fontSize: '16px',
    fontWeight: 600,
  };

  const incrementOrder = () => setMinimumOrder((prev) => prev + 1);
  const decrementOrder = () => setMinimumOrder((prev) => prev - 1);

  const handlePaymentInformation = (value) => {
    if (newPayMentInformation.includes(value)) {
      setNewPaymentInformation((prev) => prev.filter((val) => val !== value));
    } else {
      setNewPaymentInformation((prev) => [...prev, value]);
    }
  };
  // Handle price range
  const handlePriceRange = (value) => {
    setNewPriceRange(value);
  };
  const handleDietary = (value) => {
    if (newDietary.includes(value)) {
      setNewDietary((prev) => prev.filter((val) => val !== value));
    } else {
      setNewDietary((prev) => [...prev, value]);
    }
  };
  const OwnDeliveryBoyHandler = (value) => {
    setOwnDeliveryBoy(value);
  };

  // updateShopSettings(false);
  return (
    <Box sx={{ backgroundColor: '#fbfbfb', height: '100%' }}>
      <PageTop title="Settings" />
      <Box>
        <ShopSettingsSection buttonType={1} title="General" isButton buttonList={buttonListGeneral} />
        <ShopSettingsSection2
          buttonType={2}
          value={newPayMentInformation}
          title="Payment Information"
          options={PaymentInformationList}
          action={handlePaymentInformation}
          isButton
          multiple
        />

        <Divider variant="middle" sx={{ margin: '20px 0px', background: '#000000' }} />
        <ShopSettingsSection2
          buttonType={2}
          title="Price Range"
          value={newPriceRange}
          action={handlePriceRange}
          options={PriceRange}
          isButton
        />
        <ShopSettingsSection2
          buttonType={2}
          title="Dietary"
          options={DietarySettings}
          value={newDietary}
          action={handleDietary}
          isButton
          multiple
        />
        <ShopSettingsSection2
          buttonType={2}
          title="Delivery Settings"
          title2="Method"
          value={OwnDeliveryBoy}
          options={DeliverySettings}
          action={OwnDeliveryBoyHandler}
          isButton
          readOnly
        />

        <Box sx={boxSx}>
          <Divider variant="middle" sx={{ margin: '20px 0px', background: '#000000' }} />
          <MinimumOrder
            incrementOrder={incrementOrder}
            decrementOrder={decrementOrder}
            current={minimumOrder}
            TypoSx={TypoSx}
          />
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-end"
          gap={4}
          sx={{
            mt: 9,
            pb: 12,
          }}
        >
          <Button variant="outlined" color="primary">
            Discard
          </Button>
          <Button onClick={updateShopSettings} variant="contained" color="primary">
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
export default ShopSettings;
