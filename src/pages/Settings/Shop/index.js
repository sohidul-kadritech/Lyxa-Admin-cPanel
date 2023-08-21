import { Box } from '@material-ui/core';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { cloneDeep, isNaN, isNumber } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDidRecover } from 'react-router-cache-route';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import PageTop from '../../../components/Common/PageTop';
import IncrementDecrementInput from '../../../components/Form/IncrementDecrementInput';
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
  const { currentUser } = useGlobalContext();
  const { shop, adminType, admin } = currentUser;
  console.log('adminType', admin?.adminType);
  const [hasFreeDelivery] = useState(getHasFreeDelivery(shop));

  const [newShop, setNewShop] = useState(deepClone(shop));
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
  const [has_unsaved_change, set_has_unsaved_change] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newOrderCapacity, setNewOrderCapacity] = useState(newShop?.orderCapacity || 0);
  const [rateofShop, setRateofShop] = useState({
    shopExchangeRate: newShop?.shopExchangeRate,
  });

  console.log({ rateofShop });

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
        shop.shopExchangeRate = data?.data?.shop.shopExchangeRate;
        set_has_unsaved_change(false);
      }
    },
  });

  const updateShopSettings = () => {
    const { shopAcceptedCurrency, shopExchangeRate } = rateofShop;
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
      // eslint-disable-next-line prettier/prettier
      newCusines
    );

    if (rateofShop?.shopExchangeRate < rateofShop?.baseExchangeRate) {
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

  const populateStateFromShop = () => {
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
      // if (isNumber(parseInt(prev, 10)) && prev !== '') return parseInt(prev, 10) - 1;
      // if (prev === '' || prev <= 0) return 1;
      // return prev;

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
    })
  );

  const { tagsOptions, cuisinesOptions } = useMemo(
    () => filterTagsAndCuisine(tagsQuery?.data?.data?.tags),
    // eslint-disable-next-line prettier/prettier
    [tagsQuery?.data]
  );

  return (
    <>
      <Box sx={{ backgroundColor: '#fbfbfb', height: '100%' }}>
        <PageTop title="Settings" />
        <Box>
          <ShopSettingsSection
            buttonType={1}
            title="General"
            isButton
            actionTitle="Allow customers to add special instructions to individual items"
            isChecked={newSpecialInstructions}
            action={actionHandler}
          />
          <Box sx={boxSx2}>
            <ShopSettingsSection2
              boxSx={{
                paddingBottom: '29px',
              }}
              buttonType={2}
              value={newPayMentInformation}
              title="Payment Information"
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
              title="Price Range"
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
                title="Dietary"
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
              title="Tags"
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
                title="Cuisine"
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
              title="Delivery Settings"
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
                <Typography sx={TypoSx}>Order Capacity</Typography>
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
              <Typography sx={TypoSx}>Max Discount</Typography>
              <Box
                sx={{
                  marginTop: '15px',
                }}
              >
                <IncrementDecrementInput
                  min={0}
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
          </Box>
          {Number(rateofShop?.shopExchangeRate) ? (
            <Box sx={boxSx2}>
              <RateContainer
                boxSx={{
                  paddingBottom: '29px',
                }}
                title="Rate"
                rateofShop={rateofShop}
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
