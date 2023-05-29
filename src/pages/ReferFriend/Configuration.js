import { Box, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
// import StyledBox from '../Settings/Admin/Marketing/LoyaltySettings/InputBox';
import { useMutation, useQuery } from 'react-query';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import StyledBox from '../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import InputBox from './InputBox';
import { discountOptions, discountTypeOptions, durationOptions, typeList } from './helpers';

function Configuration() {
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

  const getReferFriendSettings = useQuery([API_URL.GET_REFER_A_FRIEND_SETTINGS], () =>
    // eslint-disable-next-line prettier/prettier
    AXIOS.get(API_URL.GET_REFER_A_FRIEND_SETTINGS),
  );

  useEffect(() => {
    setReceiverReferralDiscount(getReferFriendSettings?.data?.data?.referralSetting.receiver_referralDiscount || 0);
    setReceiverReferralDiscountType(
      // eslint-disable-next-line prettier/prettier
      getReferFriendSettings?.data?.data?.referralSetting.receiver_referralDiscountType || '',
    );
    setReceiverReferralDiscountType(
      // eslint-disable-next-line prettier/prettier
      getReferFriendSettings?.data?.data?.referralSetting.receiver_referralDiscountType || '',
    );

    setReceiverReferralDuration(
      // eslint-disable-next-line prettier/prettier
      getReferFriendSettings?.data?.data?.referralSetting.receiver_referralDuration || 0,
    );

    setReceiverReferralMinimumOrderValue(
      // eslint-disable-next-line prettier/prettier
      getReferFriendSettings?.data?.data?.referralSetting.receiver_referralMinimumOrderValue || 0,
    );

    setSenderReferralDiscount(getReferFriendSettings?.data?.data?.referralSetting.sender_referralDiscount || 0);
    setSenderReferralDiscountType(
      // eslint-disable-next-line prettier/prettier
      getReferFriendSettings?.data?.data?.referralSetting.sender_referralDiscountType || '',
    );
    setSenderReferralDiscountType(
      // eslint-disable-next-line prettier/prettier
      getReferFriendSettings?.data?.data?.referralSetting.sender_referralDiscountType || '',
    );

    setSenderReferralDuration(
      // eslint-disable-next-line prettier/prettier
      getReferFriendSettings?.data?.data?.referralSetting.sender_referralDuration || 0,
    );

    setSenderReferralMinimumOrderValue(
      // eslint-disable-next-line prettier/prettier
      getReferFriendSettings?.data?.data?.referralSetting.sender_referralMinimumOrderValue || 0,
    );
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
        successMsg('Updated Succesfully!', 'success');
      } else {
        successMsg('Something went wrong!');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const setTypeValidation = (type, setType, value) => {
    if (type.includes(value)) {
      return;
    }
    const oldType = type;
    oldType.push(value);
    setType(oldType);
  };

  return (
    <Box>
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
                  setSenderReferralDiscountType(() => {
                    updateConfigurationQuery.mutate({
                      sender_referralDiscountType: e.target.value,
                      type: [typeList[0]],
                    });
                    return e.target.value;
                  });
                },
              }}
            />
            <InputBox
              title="Discount (%)"
              intputType="select"
              inputProps={{
                name: 'discount',
                placeholder: 'Discount',
                value: senderReferralDiscount || 10,
                items: discountOptions,
                //   items: categories,
                onChange: (e) => {
                  setSenderReferralDiscount(() => {
                    updateConfigurationQuery.mutate({
                      sender_referralDiscount: e.target.value,
                      type: [typeList[1]],
                    });
                    return e.target.value;
                  });
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
            />
            <InputBox
              title="Duration"
              intputType="select"
              inputProps={{
                name: 'duration',
                placeholder: 'Duration Time',
                value: senderReferralDuration,
                items: durationOptions,
                //   items: categories,
                onChange: (e) => {
                  setSenderReferralDuration(() => {
                    updateConfigurationQuery.mutate({
                      sender_referralDuration: e.target.value,
                      type: [typeList[3]],
                    });
                    return e.target.value;
                  });
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
                  setReceiverReferralDiscountType(() => {
                    updateConfigurationQuery.mutate({
                      receiver_referralDiscountType: e.target.value,
                      type: [typeList[4]],
                    });
                    return e.target.value;
                  });
                },
              }}
            />
            <InputBox
              title="Discount (%)"
              intputType="select"
              inputProps={{
                name: 'discountType',
                placeholder: 'Discount',
                value: receiverReferralDiscount,
                items: discountOptions,
                //   items: categories,
                onChange: (e) => {
                  setReceiverReferralDiscount(() => {
                    updateConfigurationQuery.mutate({
                      receiver_referralDiscount: e.target.value,
                      type: [typeList[5]],
                    });
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
            />
            <InputBox
              title="Duration"
              intputType="select"
              inputProps={{
                name: 'duration',
                placeholder: 'Duration Time',
                value: receiverReferralDuration,
                items: durationOptions,
                //   items: categories,
                onChange: (e) => {
                  setReceiverReferralDuration(e.target.value);
                },
              }}
            />
          </Stack>
        </StyledBox>
      </Stack>
    </Box>
  );
}

export default Configuration;
