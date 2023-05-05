import { Box } from '@material-ui/core';
import { Button, Divider, Stack } from '@mui/material';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import PageTop from '../../../components/Common/PageTop';
import { deepClone } from '../../../helpers/deepClone';
import * as Api from '../../../network/Api';
import Axios from '../../../network/axios';
import MinimumOrder from './MinimumOrder';
import { ShopSettingsSection2 } from './ShopSettingsSection/ShopSettingsSection2';
import { General as ShopSettingsSection } from './ShopSettingsSection/index';

// data

import ConfirmModal from '../../../components/Common/ConfirmModal';
import { successMsg } from '../../../helpers/successMsg';
import { DeliverySettings, DietarySettings, PaymentInformationList, PriceRange } from './helper';

const boxSx2 = {
  padding: '32px 56px 21px 30px',
  borderRadius: '7px',
  width: '100%',
  color: '#000',
  backgroundColor: '#ffffff',
  marginBottom: '22px',
};
const TypoSx = {
  fontSize: '16px',
  fontWeight: 600,
};

function ShopSettings() {
  const shop = useSelector((store) => {
    console.log('useSelector:', store);
    return store.Login.admin;
  });

  console.log('shop', shop);

  const [newShop, setNewShop] = useState(deepClone(shop));
  console.log('shop', newShop);
  const [newPayMentInformation, setNewPaymentInformation] = useState(newShop?.paymentOption);
  const [newPriceRange, setNewPriceRange] = useState(newShop?.expensive);
  const [newDietary, setNewDietary] = useState(newShop?.dietary);
  const [minimumOrder, setMinimumOrder] = useState(newShop?.minOrderAmount);
  const [OwnDeliveryBoy, setOwnDeliveryBoy] = useState(newShop?.haveOwnDeliveryBoy);

  const [has_unsaved_change, set_has_unsaved_change] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const updateShopSettings = () => {
    const oldShop = newShop;
    oldShop.shopAddress = newShop.address;
    const newShopAddress = {
      latitude: oldShop.shopAddress.latitude,
      longitude: oldShop.shopAddress.longitude,
      country: oldShop.shopAddress.country,
      state: oldShop.shopAddress.state,
      city: oldShop.shopAddress.city,
      pin: oldShop.shopAddress.pin,
      primary: false,
      note: oldShop.shopAddress.note,
    };

    console.log('new address', newShopAddress);
    console.log('old address', oldShop.shopAddress);

    const dataBody = {
      // ...oldShop,
      id: newShop?._id,
      paymentOption: newPayMentInformation,
      expensive: newPriceRange,
      dietary: newDietary,
      haveOwnDeliveryBoy: OwnDeliveryBoy,
      minOrderAmount: minimumOrder,
      shopAddress: newShopAddress,
    };
    console.log('body ; ', dataBody);
    return Axios.post(Api.EDIT_SHOP, dataBody);
  };

  const updateData = useMutation(updateShopSettings, {
    onSuccess: (data) => {
      successMsg(data?.message, data.status ? 'success' : undefined);
      if (data?.status) {
        shop.paymentOption = data?.data?.shop.paymentOption || shop.paymentOption;
        shop.expensive = data?.data?.shop.expensive || shop.expensive;
        shop.dietary = data?.data?.shop.dietary || shop.dietary;
        shop.minOrderAmount = data?.data?.shop.minOrderAmount || shop.minOrderAmount;
        shop.haveOwnDeliveryBoy = data?.data?.shop.haveOwnDeliveryBoy || shop.haveOwnDeliveryBoy;
        console.log('Data Updated: ', data.data);
        set_has_unsaved_change(false);
      }
    },
  });

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

  const populateStateFromShop = () => {
    // setNewShop(shop);
    setNewPaymentInformation(shop?.paymentOption);
    setNewPriceRange(shop?.expensive);
    setNewDietary(shop?.dietary);
    setMinimumOrder(shop?.minOrderAmount);
    setOwnDeliveryBoy(shop?.haveOwnDeliveryBoy);
    // setNewShop(shop);
  };

  useEffect(() => {
    console.log('ami use effecte achi: ');
    populateStateFromShop();
  }, []);

  const buttonListGeneral = [
    {
      actionTitle: 'Allow customers to add special instructions to individual items',
      action: actionHandler,
      isChecked: true,
    },
  ];

  // Handle Incremented by one
  const incrementOrder = () => {
    set_has_unsaved_change(true);
    setMinimumOrder((prev) => prev + 1);
  };
  // Handle decremented by one
  const decrementOrder = () => {
    set_has_unsaved_change(true);
    setMinimumOrder((prev) => prev - 1);
  };

  // HandlePaymentInformation where we deal with muliple payment system
  const handlePaymentInformation = (value) => {
    if (newPayMentInformation.includes(value)) {
      setNewPaymentInformation((prev) => prev.filter((val) => val !== value));
    } else {
      setNewPaymentInformation((prev) => [...prev, value]);
    }
    set_has_unsaved_change(true);
  };

  // Handle price range
  const handlePriceRange = (value) => {
    setNewPriceRange(value);
    set_has_unsaved_change(true);
  };

  // Handle Dietary information
  const handleDietary = (value) => {
    if (newDietary.includes(value)) {
      setNewDietary((prev) => prev.filter((val) => val !== value));
    } else {
      setNewDietary((prev) => [...prev, value]);
    }
    set_has_unsaved_change(true);
  };

  // Handle OwnDeliveryBoy
  const OwnDeliveryBoyHandler = (value) => {
    setOwnDeliveryBoy(value);
    set_has_unsaved_change(true);
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#fbfbfb', height: '100%' }}>
        <PageTop title="Settings" />
        <Box>
          <ShopSettingsSection buttonType={1} title="General" isButton buttonList={buttonListGeneral} />
          <Box sx={boxSx2}>
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
          </Box>
          <Box sx={boxSx2}>
            <ShopSettingsSection2
              buttonType={2}
              title="Dietary"
              options={DietarySettings}
              value={newDietary}
              action={handleDietary}
              isButton
              multiple
            />
          </Box>
          <Box sx={boxSx2}>
            <ShopSettingsSection2
              buttonType={2}
              title="Delivery Settings"
              title2="Method"
              value={OwnDeliveryBoy}
              options={DeliverySettings}
              action={OwnDeliveryBoyHandler}
              isButton
              readOnly
              isMethod
            />
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
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                if (has_unsaved_change) {
                  setIsConfirmModalOpen(true);
                }
              }}
            >
              Discard
            </Button>
            <Button onClick={updateData.mutate} variant="contained" color="primary" disabled={updateData.isLoading}>
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Box>
      <ConfirmModal
        message="Your unsaved changes will be lost. Discard?"
        isOpen={isConfirmModalOpen}
        blurClose
        onCancel={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          populateStateFromShop();
          setNewShop(cloneDeep(shop));
          set_has_unsaved_change(false);
          setIsConfirmModalOpen(false);
        }}
      />
    </>
  );
}
export default ShopSettings;
