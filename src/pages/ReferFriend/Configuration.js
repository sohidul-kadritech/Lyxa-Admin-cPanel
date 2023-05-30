import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
// import StyledBox from '../Settings/Admin/Marketing/LoyaltySettings/InputBox';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import StyledBox from '../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import InputBox from './InputBox';
import PageSkeleton from './PageSkeleton';
import { discountOptions, discountTypeOptions, durationOptions, typeList } from './helpers';

function Configuration() {
  // eslint-disable-next-line no-unused-vars
  const [isConfirm, setIsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [hasChanged, setHasChanged] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [receiverReferralDiscount, setReceiverReferralDiscount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [receiverReferralDiscountType, setReceiverReferralDiscountType] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [receiverReferralDuration, setReceiverReferralDuration] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [receiverReferralMinimumOrderValue, setReceiverReferralMinimumOrderValue] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [senderReferralDiscount, setSenderReferralDiscount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [senderReferralDiscountType, setSenderReferralDiscountType] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [senderReferralDuration, setSenderReferralDuration] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [senderReferralMinimumOrderValue, setSenderReferralMinimumOrderValue] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState([]);
  const queryClient = useQueryClient();
  const getReferFriendSettings = useQuery([API_URL.GET_REFER_A_FRIEND_SETTINGS], () =>
    // eslint-disable-next-line prettier/prettier
		AXIOS.get(API_URL.GET_REFER_A_FRIEND_SETTINGS)
  );

  const populate = () => {
    setHasChanged(false);
    setLoading(false);
    setReceiverReferralDiscount(getReferFriendSettings?.data?.data?.referralSetting.receiver_referralDiscount || 0);
    setReceiverReferralDiscountType(
      // eslint-disable-next-line prettier/prettier
			getReferFriendSettings?.data?.data?.referralSetting.receiver_referralDiscountType || ''
    );
    setReceiverReferralDiscountType(
      // eslint-disable-next-line prettier/prettier
			getReferFriendSettings?.data?.data?.referralSetting.receiver_referralDiscountType || ''
    );

    setReceiverReferralDuration(
      // eslint-disable-next-line prettier/prettier
			getReferFriendSettings?.data?.data?.referralSetting.receiver_referralDuration || 30
    );

    setReceiverReferralMinimumOrderValue(
      // eslint-disable-next-line prettier/prettier
			getReferFriendSettings?.data?.data?.referralSetting.receiver_referralMinimumOrderValue || 0
    );

    setSenderReferralDiscount(getReferFriendSettings?.data?.data?.referralSetting.sender_referralDiscount || 0);
    setSenderReferralDiscountType(
      // eslint-disable-next-line prettier/prettier
			getReferFriendSettings?.data?.data?.referralSetting.sender_referralDiscountType || ''
    );
    setSenderReferralDiscountType(
      // eslint-disable-next-line prettier/prettier
			getReferFriendSettings?.data?.data?.referralSetting.sender_referralDiscountType || ''
    );

    setSenderReferralDuration(
      // eslint-disable-next-line prettier/prettier
			getReferFriendSettings?.data?.data?.referralSetting.sender_referralDuration || 30
    );

    setSenderReferralMinimumOrderValue(
      // eslint-disable-next-line prettier/prettier
			getReferFriendSettings?.data?.data?.referralSetting.sender_referralMinimumOrderValue || 0
    );
    setType([]);
    setIsConfirm(false);
  };

  useEffect(() => {
    populate();
  }, [getReferFriendSettings?.data?.data?.referralSetting]);

  const incrementHandler = (setValue) => {
    setValue((prev) => prev + 1);
  };
  const decrementHandler = (setValue) => {
    setValue((prev) => prev + 1);
  };

  // eslint-disable-next-line no-unused-vars
  const updateConfigurationQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_REFER_A_FRIEND_SETTINGS, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL.GET_REFER_A_FRIEND_SETTINGS);
        successMsg('Updated Succesfully!', 'success');
      } else {
        successMsg('Something went wrong!');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const setTypeValidation = (type, setType, value) => {
    setHasChanged(true);
    if (type.includes(value)) {
      return;
    }
    const oldType = type;
    oldType.push(value);
    setType(oldType);
  };

  // eslint-disable-next-line no-unused-vars
  const updateConfiguration = () => {
    const data = {
      sender_referralDiscountType: senderReferralDiscountType,
      sender_referralDiscount: senderReferralDiscount,
      sender_referralMinimumOrderValue: senderReferralMinimumOrderValue,
      sender_referralDuration: senderReferralDuration,
      receiver_referralDiscountType: receiverReferralDiscountType,
      receiver_referralDiscount: receiverReferralDiscount,
      receiver_referralMinimumOrderValue: receiverReferralMinimumOrderValue,
      receiver_referralDuration: receiverReferralDuration,
      type,
    };
    updateConfigurationQuery.mutate(data);
  };

  return (
    <Box>
      {getReferFriendSettings.isLoading ? (
        <PageSkeleton />
      ) : (
        <>
          <Stack>
            <StyledBox title="Sender">
              <Stack flexDirection="row" flexWrap="wrap" gap="10%">
                <InputBox
                  title="Discount Type"
                  intputType="select"
                  inputProps={{
                    name: 'discountType',
                    placeholder: 'Discount Type',
                    value: senderReferralDiscountType || '',
                    items: discountTypeOptions,
                    //   items: categories,
                    onChange: (e) => {
                      setTypeValidation(type, setType, typeList[0]);
                      setSenderReferralDiscountType(() => e.target.value);
                    },
                  }}
                />
                <InputBox
                  title="Discount (%)"
                  intputType="select"
                  inputProps={{
                    name: 'discount',
                    placeholder: 'Discount',
                    value: senderReferralDiscount.toString(),
                    items: discountOptions,
                    //   items: categories,
                    onChange: (e) => {
                      setTypeValidation(type, setType, typeList[1]);
                      setSenderReferralDiscount(() => e.target.value);
                    },
                  }}
                />
                <InputBox
                  title="Minimum Order Value ($)"
                  intputType="incrementButton"
                  currentValue={senderReferralMinimumOrderValue}
                  setValue={setSenderReferralMinimumOrderValue}
                  incrementHandler={incrementHandler}
                  decrementHandler={decrementHandler}
                  setTypeValidation={() => {
                    setTypeValidation(type, setType, typeList[2]);
                  }}
                />
                <InputBox
                  title="Duration"
                  intputType="select"
                  inputProps={{
                    name: 'duration',
                    placeholder: 'Duration Time',
                    value: senderReferralDuration.toString(),
                    items: durationOptions,
                    //   items: categories,
                    onChange: (e) => {
                      setTypeValidation(type, setType, typeList[3]);
                      setSenderReferralDuration(() => e.target.value);
                    },
                  }}
                />
              </Stack>
            </StyledBox>
            <StyledBox title="Receiver">
              <Stack flexDirection="row" flexWrap="wrap" gap="10%">
                <InputBox
                  title="Discount Type"
                  intputType="select"
                  inputProps={{
                    name: 'discountType',
                    placeholder: 'Discount Type',
                    value: receiverReferralDiscountType,
                    items: discountTypeOptions,
                    //   items: categories,
                    onChange: (e) => {
                      setTypeValidation(type, setType, typeList[4]);
                      setReceiverReferralDiscountType(() => e.target.value);
                    },
                  }}
                />
                <InputBox
                  title="Discount (%)"
                  intputType="select"
                  inputProps={{
                    name: 'discountType',
                    placeholder: 'Discount',
                    value: receiverReferralDiscount.toString(),
                    items: discountOptions,
                    //   items: categories,
                    onChange: (e) => {
                      setReceiverReferralDiscount(() => {
                        setTypeValidation(type, setType, typeList[5]);
                        return e.target.value;
                      });
                    },
                  }}
                />
                <InputBox
                  title="Minimum Order Value ($)"
                  intputType="incrementButton"
                  currentValue={receiverReferralMinimumOrderValue}
                  setValue={setReceiverReferralMinimumOrderValue}
                  incrementHandler={incrementHandler}
                  decrementHandler={decrementHandler}
                  setTypeValidation={() => {
                    setTypeValidation(type, setType, typeList[6]);
                  }}
                />
                <InputBox
                  title="Duration"
                  intputType="select"
                  inputProps={{
                    name: 'duration',
                    placeholder: 'Duration Time',
                    value: receiverReferralDuration.toString(),
                    items: durationOptions,
                    //   items: categories,
                    onChange: (e) => {
                      setTypeValidation(type, setType, typeList[7]);
                      setReceiverReferralDuration(e.target.value);
                    },
                  }}
                />
              </Stack>
            </StyledBox>
          </Stack>

          <Stack flexDirection="row" justifyContent="flex-end" marginTop="30px" gap="20px">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                if (hasChanged) {
                  setIsConfirm(true);
                } else {
                  successMsg('Please make a change first!');
                }
              }}
            >
              Discard
            </Button>
            <Button
              onClick={() => {
                if (hasChanged) {
                  updateConfiguration();
                } else {
                  successMsg('Please make a change first!');
                }
              }}
              variant="contained"
              color="primary"
              disabled={updateConfigurationQuery?.isLoading}
            >
              Save Changes
            </Button>
          </Stack>
        </>
      )}
      <ConfirmModal
        message="Do you want to discard the changes ?"
        isOpen={isConfirm}
        blurClose
        loading={loading}
        onCancel={() => {
          setIsConfirm(false);
        }}
        onConfirm={() => {
          // callDeleteFaq();
          setLoading(true);

          populate();
          // setHasChanged(false);
        }}
      />
    </Box>
  );
}

export default Configuration;
