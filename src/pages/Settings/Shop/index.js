/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box } from '@material-ui/core';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { cloneDeep, isNaN, isNumber } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDidRecover } from 'react-router-cache-route';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import PageTop from '../../../components/Common/PageTop';
import { TitleWithToolTip } from '../../../components/Common/TitleWithToolTip';
import IncrementDecrementInput from '../../../components/Form/IncrementDecrementInput';
import StyledInput from '../../../components/Styled/StyledInput';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import { useGlobalContext } from '../../../context';
import { deepClone } from '../../../helpers/deepClone';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import Axios from '../../../network/axios';
import { getDietaryOptions } from '../../Menu/helpers';
import IncrementDecrementButton from '../../ReferFriend/IncrementDecrementButton';
import MinimumOrder from './MinimumOrder';
import RateContainer from './Rate';
import { ShopSettingsSection2 } from './ShopSettingsSection/ShopSettingsSection2';
import { ShopSettingsSection3 } from './ShopSettingsSection/ShopSettingsSection3';
import { General as ShopSettingsSection } from './ShopSettingsSection/index';
import { DeliverySettings, PaymentInformationList, PriceRange, createShopSettingsData } from './helper';

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
const section2Sx = {
  width: '100%',
};

export const paymentInformationValidation = (paymentmethod) => {
  if (paymentmethod.length > 0) return true;

  successMsg('Please Select at least one payment method!');

  return false;
};

const filterTagsAndCuisine = (tagsCuisine) => {
  const tagsOptions = [];
  const cuisinesOptions = [];

  tagsCuisine?.forEach((tag) => {
    if (tag?.type === 'tag') tagsOptions.push(tag);
    else cuisinesOptions.push(tag);
  });

  return { tagsOptions, cuisinesOptions };
};

const getHasFreeDelivery = (shop) => {
  let hasDeal = false;

  shop?.marketings?.forEach((obj) => {
    if (obj?.type === 'free_delivery') {
      hasDeal = true;
    }
  });

  return hasDeal;
};

function ShopSettings() {
  const { currentUser, general } = useGlobalContext();
  const { shop, adminType, admin } = currentUser;
  const { currency } = general;

  const [hasFreeDelivery] = useState(getHasFreeDelivery(shop));

  const [newShop, setNewShop] = useState(deepClone(shop));

  const [isShopNoteForRiderEnabled, setIsShopNoteForRiderEnabled] = useState(newShop?.isShopNoteForRiderEnabled);
  const [newShopNote, setNewShopNote] = useState(newShop?.shopNote);
  const [newPayMentInformation, setNewPaymentInformation] = useState(newShop?.paymentOption || []);
  const [newPriceRange, setNewPriceRange] = useState(newShop?.expensive || '');
  const [newDietary, setNewDietary] = useState(newShop?.dietary || []);
  const [newDeliveryFee, setNewDeliveryFee] = useState(newShop?.deliveryFee || 0);
  const [minimumOrder, setMinimumOrder] = useState(newShop?.minOrderAmount || 0);
  const [newTags, setNewTags] = useState(newShop?.tagsId || []);
  const [newCusines, setNewCusines] = useState(newShop?.cuisineType || []);

  const [newSpecialInstructions, setNewSpecialInstructions] = useState(newShop?.specialInstructions || false);
  const [OwnDeliveryBoy, setOwnDeliveryBoy] = useState(newShop?.haveOwnDeliveryBoy);
  const [newMaxDiscount, setNewMaxDiscount] = useState(newShop?.maxDiscount?.toString() || '100');
  // defaultPreparationTime
  const [defaultPreparationTime, setDefaultPreparationTime] = useState(newShop?.defaultPreparationTime);
  const [has_unsaved_change, set_has_unsaved_change] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newOrderCapacity, setNewOrderCapacity] = useState(newShop?.orderCapacity || 0);
  const [reateOfShop, setRateofShop] = useState({
    shopExchangeRate: newShop?.shopExchangeRate,
  });

  const updateData = useMutation((data) => Axios.post(Api.EDIT_SHOP, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data.status ? 'success' : undefined);
      if (data?.status) {
        shop.paymentOption = data?.data?.shop.paymentOption || shop.paymentOption;
        shop.maxDiscount = data?.data?.shop.maxDiscount || shop?.maxDiscount;
        shop.expensive = data?.data?.shop.expensive || shop.expensive;
        shop.dietary = data?.data?.shop.dietary || shop.dietary;
        shop.specialInstructions = data?.data?.shop?.specialInstructions;
        shop.deliveryFee = data?.data?.shop?.deliveryFee;
        shop.minOrderAmount = data?.data?.shop.minOrderAmount || shop.minOrderAmount;
        shop.haveOwnDeliveryBoy = data?.data?.shop.haveOwnDeliveryBoy || shop.haveOwnDeliveryBoy;
        shop.tagsId = data?.data?.shop.tagsId || shop.tagsId;
        shop.cuisineType = data?.data?.shop.cuisineType || shop.cuisineType;
        shop.shopExchangeRate = data?.data?.shop?.shopExchangeRate;
        shop.shopNote = data?.data?.shop?.shopNote;
        shop.isShopNoteForRiderEnabled = data?.data?.shop?.isShopNoteForRiderEnabled;
        shop.defaultPreparationTime = data?.data?.shop?.defaultPreparationTime;
        set_has_unsaved_change(false);
      }
    },
  });

  const updateShopSettings = () => {
    const { shopAcceptedCurrency, shopExchangeRate } = reateOfShop;
    const data = createShopSettingsData(
      shop,
      newMaxDiscount,
      minimumOrder,
      newPayMentInformation,
      newDietary,
      newPriceRange,
      newOrderCapacity,
      newSpecialInstructions,
      newDeliveryFee,
      OwnDeliveryBoy,
      adminType,
      newTags,
      shopAcceptedCurrency,
      shopExchangeRate,
      newCusines,
      newShopNote,
      isShopNoteForRiderEnabled,
      defaultPreparationTime,
    );

    if (reateOfShop?.shopExchangeRate < reateOfShop?.baseExchangeRate) {
      successMsg(`The rate is too low!`);
      return;
    }

    if (data) {
      updateData.mutate(data);
    } else {
      successMsg('Please check your data');
    }
  };

  const actionHandler = (isActive) => {
    set_has_unsaved_change(true);
    setNewSpecialInstructions(!isActive);
    return !isActive;
  };

  const actionHandlerForRiderNotes = (isActive) => {
    set_has_unsaved_change(true);
    setIsShopNoteForRiderEnabled(!isActive);
    return !isActive;
  };

  const populateStateFromShop = () => {
    setNewShopNote(shop?.shopNote);
    setNewPaymentInformation(shop?.paymentOption);
    setNewPriceRange(shop?.expensive);
    setNewDietary(shop?.dietary);
    setMinimumOrder(shop?.minOrderAmount);
    setOwnDeliveryBoy(shop?.haveOwnDeliveryBoy);
    setNewMaxDiscount(shop?.maxDiscount?.toString() || '');
    setNewOrderCapacity(shop?.orderCapacity || 0);
    setNewDeliveryFee(shop?.deliveryFee || 0);
    setNewSpecialInstructions(() => shop?.specialInstructions || false);
    setNewCusines(shop?.cuisineType || []);
    setNewTags(shop?.tagsId || []);
    setRateofShop((prev) => ({ ...prev, shopAcceptedCurrency: 'both', shopExchangeRate: newShop?.shopExchangeRate }));
  };

  useDidRecover(() => {
    populateStateFromShop();
  });

  useEffect(() => {
    populateStateFromShop();
  }, []);

  const incrementOrder = (setValue) => {
    set_has_unsaved_change(true);
    setValue((prev) => {
      if (isNumber(parseInt(prev, 10)) && prev !== '' && !isNaN(prev) && prev) return parseInt(prev, 10) + 1;
      if (prev === '' || isNaN(prev) || !prev) return 1;
      return prev;
    });
  };

  // Handle decremented by one
  const decrementOrder = (setValue) => {
    set_has_unsaved_change(true);
    setValue((prev) => {
      if (Number(prev) <= 1) return 1;
      return prev - 1;
    });
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

  // Handle max discount
  const maxDiscountHandler = (value) => {
    setNewMaxDiscount(value);
    set_has_unsaved_change(true);
  };

  const tagsQuery = useQuery([Api.GET_ALL_TAGS_AND_CUSINES], () =>
    Axios.get(Api.GET_ALL_TAGS_AND_CUSINES, {
      params: {
        page: 1,
        pageSize: 500,
        shopType: shop?.shopType,
        status: 'active',
      },
      // eslint-disable-next-line prettier/prettier
    }),
  );

  const { tagsOptions, cuisinesOptions } = useMemo(
    () => filterTagsAndCuisine(tagsQuery?.data?.data?.tags),
    // eslint-disable-next-line prettier/prettier
    [tagsQuery?.data],
  );

  return (
    <>
      <Box sx={{ backgroundColor: '#fbfbfb', height: '100%' }}>
        <PageTop title="Settings" />
        <Box>
          <ShopSettingsSection
            buttonType={1}
            title={
              <TitleWithToolTip
                title="General"
                tooltip="When this feature is active, users can effortlessly customize product instructions using their preferred apps."
                sx={{ fontSize: '16px', fontWeight: 600 }}
              />
            }
            isButton
            actionTitle="Allow customers to add special instructions to individual items"
            isChecked={newSpecialInstructions}
            action={actionHandler}
          />

          {/* shop rider notes */}
          <ShopSettingsSection
            buttonType={1}
            showSwitch
            title={
              <TitleWithToolTip
                title="Shop note to riders"
                tooltip="When enabled, riders can view these notes when accepting orders."
                sx={{ fontSize: '16px', fontWeight: 600 }}
              />
            }
            isButton
            gapValue={50 / 4}
            action={actionHandlerForRiderNotes}
          >
            <Stack direction="row" flex={1} width="100%">
              <StyledInput
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': {
                    width: '100%',
                  },
                }}
                inputProps={{
                  type: 'text',
                  value: newShopNote,
                  onChange: (e) => {
                    set_has_unsaved_change(true);
                    setNewShopNote(e?.target?.value);
                  },
                  placeholder: 'shop notes ...',
                }}
              />
            </Stack>
          </ShopSettingsSection>
          <Box sx={boxSx2}>
            <ShopSettingsSection2
              boxSx={{
                paddingBottom: '29px',
              }}
              buttonType={2}
              value={newPayMentInformation}
              title={
                <TitleWithToolTip
                  title="Payment Information"
                  tooltip="It specified the payment methods accepted by this store."
                  sx={{ fontSize: '16px', fontWeight: 600 }}
                />
              }
              options={PaymentInformationList}
              action={handlePaymentInformation}
              isButton
              multiple
            />
            <Divider variant="middle" sx={{ background: '#000000' }} />
            <ShopSettingsSection2
              boxSx={{
                paddingTop: '29px',
              }}
              buttonType={2}
              disabled={admin?.adminType === 'admin' ? false : admin?.adminType !== 'accountManager'}
              title={
                <TitleWithToolTip
                  title="Price Range"
                  tooltip="This is only editable by super admin and account manager of this shop."
                  sx={{ fontSize: '16px', fontWeight: 600 }}
                />
              }
              title2="Method"
              accessType="SUPERADMIN / ACCOUNTMANAGER"
              value={newPriceRange}
              action={handlePriceRange}
              options={PriceRange}
              isMethod
              isButton
            />
          </Box>
          {shop?.shopType !== 'pharmacy' && (
            <Box sx={boxSx2}>
              <ShopSettingsSection2
                boxSx={section2Sx}
                buttonType={2}
                title={
                  <TitleWithToolTip
                    title="Dietary"
                    tooltip="Dietary information indicates the types of diets followed by this store."
                    sx={{ fontSize: '16px', fontWeight: 600 }}
                  />
                }
                options={getDietaryOptions(shop?.shopType)}
                value={newDietary}
                action={handleDietary}
                isButton
                multiple
              />
            </Box>
          )}
          <Box sx={boxSx2}>
            <ShopSettingsSection3
              boxSx={section2Sx}
              setHasChanged={set_has_unsaved_change}
              title={
                <TitleWithToolTip
                  title="Tags"
                  tooltip="What kinds of foods the store offers"
                  sx={{ fontSize: '16px', fontWeight: 600 }}
                />
              }
              options={tagsOptions}
              loading={tagsQuery?.isLoading}
              value={newTags}
              setValue={setNewTags}
            />
          </Box>
          {shop?.shopType === 'food' && (
            <Box sx={boxSx2}>
              <ShopSettingsSection3
                boxSx={section2Sx}
                setHasChanged={set_has_unsaved_change}
                title={
                  <TitleWithToolTip
                    title="Cuisine"
                    tooltip="What kinds of cuisine the store follows"
                    sx={{ fontSize: '16px', fontWeight: 600 }}
                  />
                }
                options={cuisinesOptions}
                loading={tagsQuery?.isLoading}
                value={newCusines}
                setValue={setNewCusines}
              />
            </Box>
          )}
          <Box sx={boxSx2}>
            <ShopSettingsSection2
              boxSx={{
                paddingBottom: '20px',
              }}
              buttonType={2}
              title={
                <TitleWithToolTip
                  title="Delivery Settings"
                  tooltip="We offer two delivery options: 'Lyxa' and 'Store'. When 'Lyxa' is selected, Lyxa handles all delivery-related responsibilities; otherwise, the store takes care of them."
                  sx={{ fontSize: '16px', fontWeight: 600 }}
                />
              }
              title2="Method"
              value={OwnDeliveryBoy}
              options={DeliverySettings}
              action={OwnDeliveryBoyHandler}
              isButton
              readOnly={adminType !== 'admin' || hasFreeDelivery}
              disabled={adminType !== 'admin' || hasFreeDelivery}
              isMethod
            />
            {/* <Divider variant="middle" sx={{ background: '#000000' }} /> */}
            {OwnDeliveryBoy && (
              <Box
                sx={{
                  paddingBottom: '21px',
                  paddingTop: '0px',
                }}
              >
                <Typography sx={TypoSx}>Delivery Fee</Typography>
                <Box
                  sx={{
                    marginTop: '15px',
                  }}
                >
                  <IncrementDecrementButton
                    currentValue={newDeliveryFee}
                    endAdornment={currency?.symbol}
                    setValue={(value) => {
                      set_has_unsaved_change(true);
                      if (typeof value === 'function') {
                        setNewDeliveryFee(value);
                      } else if (Number(value) <= 1) setNewDeliveryFee(1);
                      else setNewDeliveryFee(value);
                    }}
                    incrementHandler={incrementOrder}
                    decrementHandler={decrementOrder}
                    setTypeValidation={() => {
                      set_has_unsaved_change(true);
                    }}
                  />
                </Box>
              </Box>
            )}
            <Divider variant="middle" sx={{ background: '#000000' }} />
            <MinimumOrder
              boxSx={{
                paddingTop: '21px',
                paddingBottom: '21px',
              }}
              incrementOrder={incrementOrder}
              decrementOrder={decrementOrder}
              setValue={setMinimumOrder}
              setHasChanged={() => {
                set_has_unsaved_change(true);
              }}
              current={minimumOrder !== null ? minimumOrder : 0}
              TypoSx={TypoSx}
            />
            <Divider variant="middle" sx={{ background: '#000000' }} />
            <Box
              sx={{
                paddingTop: '21px',
                paddingBottom: '21px',
              }}
            >
              <Stack direction="row" alignItems="center" gap={10}>
                <Typography sx={TypoSx}>
                  <TitleWithToolTip
                    title="Order Capacity"
                    tooltip="The store can only make a certain number of orders at once. If order capacity is full user can't place order in this shop.users need to wait until store finish some orders. After the availabilty of their capacity user can order."
                    sx={{ fontSize: '16px', fontWeight: 600 }}
                  />
                </Typography>
                <StyledSwitch
                  checked={Number(newOrderCapacity) > 0}
                  onChange={() => {
                    set_has_unsaved_change(true);
                    setNewOrderCapacity(Number(newOrderCapacity) > 0 ? 0 : 1);
                  }}
                />
              </Stack>
              {Number(newOrderCapacity) > 0 && (
                <Box
                  sx={{
                    marginTop: '15px',
                  }}
                >
                  <IncrementDecrementButton
                    currentValue={newOrderCapacity}
                    endAdornment="orders"
                    setValue={(value) => {
                      if (typeof value === 'function') {
                        setNewOrderCapacity(value);
                      } else if (Number(value) <= 1) setNewOrderCapacity(1);
                      else setNewOrderCapacity(value);
                    }}
                    incrementHandler={incrementOrder}
                    decrementHandler={decrementOrder}
                    setTypeValidation={() => {
                      set_has_unsaved_change(true);
                    }}
                  />
                </Box>
              )}
            </Box>
            <Divider variant="middle" sx={{ background: '#000000' }} />
            <Box
              sx={{
                paddingTop: '21px',
              }}
            >
              <Typography sx={TypoSx}>
                <TitleWithToolTip
                  title="Max Discount Per Item (Marketing)"
                  tooltip="Maxium discount amount that shop can offer on each product item."
                  sx={{ fontSize: '16px', fontWeight: 600 }}
                />
              </Typography>
              <Box
                sx={{
                  marginTop: '15px',
                }}
              >
                <IncrementDecrementInput
                  endAdornment={currency?.symbol}
                  min={0}
                  // max={100}
                  step={5}
                  dynamicWidth
                  value={newMaxDiscount}
                  onChange={(value) => {
                    set_has_unsaved_change(true);
                    maxDiscountHandler(value);
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                paddingTop: '21px',
              }}
            >
              <Typography sx={TypoSx}>
                <TitleWithToolTip
                  title="Default Preparation time"
                  tooltip="When store try to accept any orders the default preparation time will selected. that we put here."
                  sx={{ fontSize: '16px', fontWeight: 600 }}
                />
              </Typography>
              <Box
                sx={{
                  marginTop: '15px',
                }}
              >
                <IncrementDecrementInput
                  endAdornment="min"
                  min={0}
                  max={60}
                  step={5}
                  dynamicWidth
                  value={defaultPreparationTime}
                  onChange={(value) => {
                    set_has_unsaved_change(true);
                    setDefaultPreparationTime(Number(value));
                  }}
                />
              </Box>
            </Box>
          </Box>
          {Number(reateOfShop?.shopExchangeRate) ? (
            <Box sx={boxSx2}>
              <RateContainer
                boxSx={{
                  paddingBottom: '29px',
                }}
                title={
                  <TitleWithToolTip
                    title="Rate"
                    tooltip="An admin can set a rate, and the shop can change it by 10% more, 10% less, or keep it the same."
                  />
                }
                rateofShop={reateOfShop}
                setRateofShop={setRateofShop}
                setHasChanged={set_has_unsaved_change}
              />
            </Box>
          ) : null}
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
            <Button
              onClick={() => {
                if (!paymentInformationValidation(newPayMentInformation)) {
                  set_has_unsaved_change(false);
                  return;
                }

                if (!has_unsaved_change) {
                  successMsg('Please make some changes first!');
                  return;
                }

                if (newTags?.length < 1) {
                  successMsg('Please choose atleast one tag!');
                  return;
                }

                if (newCusines?.length < 1 && shop?.shopType === 'food') {
                  successMsg('Please add atleast one cuisine!');
                  return;
                }

                updateShopSettings();
              }}
              variant="contained"
              color="primary"
              disabled={updateData.isLoading}
            >
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
