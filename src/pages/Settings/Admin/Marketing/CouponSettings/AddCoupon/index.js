// thrid party
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { ReactComponent as DropIcon } from '../../../../../../assets/icons/down.svg';
import SidebarContainer from '../../../../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../../../../components/Form/StyledFormField';
import * as Api from '../../../../../../network/Api';
import AXIOS from '../../../../../../network/axios';
import {
  checkedInit,
  couponDiscountTypeOptions,
  couponTypeToTitleMap,
  createCouponUploaData,
  getCouponInit,
  validateCoupon,
} from './helpers';

export default function AddCoupon({ onClose, couponType }) {
  const [coupon, setCoupon] = useState(getCouponInit(couponType));
  const [checked, setChecked] = useState({ ...checkedInit });

  // handlers
  const commonChangeHandler = (e) => {
    setCoupon((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const commonCheckHandler = (event, property) => {
    setChecked((prev) => ({ ...prev, [property]: event.target.checked }));
  };

  // shops query
  const shopsQuery = useQuery(['ALL_SHOP', { type: 'all' }], () =>
    AXIOS.get(Api.ALL_SHOP, {
      params: {
        type: 'all',
      },
    })
  );

  const shopsOptions = shopsQuery?.data?.data?.shops || [];

  // shops query
  const usersQuery = useQuery(['ALL_USERS', { type: 'all' }], () =>
    AXIOS.get(Api.ALL_USERS, {
      params: {
        page: 1,
        pageSize: 10000,
        searchKey: '',
        sortBy: 'desc',
        status: 'all',
      },
    })
  );

  console.log(usersQuery?.data?.data);

  // coupon add
  const couponMutation = useMutation((data) => AXIOS.post(Api.ADD_COUPON, data), {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const submitCoupon = () => {
    const valid = validateCoupon(coupon);

    if (!valid.status) {
      return;
    }

    const couponData = createCouponUploaData(coupon, checked, couponType);
    couponMutation.mutate(couponData);
  };

  return (
    <SidebarContainer title={`Generate Coupon: ${couponTypeToTitleMap[couponType]}`} onClose={onClose}>
      {/* name */}
      <StyledFormField
        label="Name"
        intputType="text"
        inputProps={{
          type: 'text',
          name: 'couponName',
          value: coupon.couponName,
          onChange: commonChangeHandler,
          sx: {
            '& input': {
              textTransform: 'uppercase',
            },
          },
        }}
      />
      {/* user */}
      <StyledFormField
        label="User"
        intputType="autocomplete"
        inputProps={{
          maxHeight: '300px',
          options: usersQuery?.data?.data?.users,
          value: (coupon?.couponUsers && coupon?.couponUsers[0]) || null,
          isOptionEqualToValue: (option, value) => option?._id === value?._id,
          getOptionLabel: (option) => option?.name,
          sx: {
            flex: 1,
          },
          onChange: (e, v) => {
            setCoupon((prev) => ({ ...prev, couponUsers: [v] }));
          },
        }}
      />
      {/* type */}
      <StyledFormField
        label="Type"
        intputType="select"
        inputProps={{
          name: 'couponDiscountType',
          value: coupon.couponDiscountType,
          items: couponDiscountTypeOptions,
          onChange: commonChangeHandler,
        }}
      />
      {/* value */}
      {coupon.couponDiscountType !== 'free_delivery' && (
        <StyledFormField
          label="Value"
          intputType="text"
          inputProps={{
            type: 'number',
            name: 'couponValue',
            value: coupon.couponValue,
            onChange: commonChangeHandler,
          }}
        />
      )}
      {/* start date */}
      <StyledFormField
        label="Duration start"
        intputType="date"
        inputProps={{
          fullWidth: true,
          variant: 'form',
          value: coupon.couponDuration.start,
          onChange: (e) => {
            setCoupon((prev) => ({
              ...prev,
              couponDuration: {
                ...prev.couponDuration,
                start: e._d,
              },
            }));
          },
        }}
      />
      {/* start date */}
      <StyledFormField
        label="Duration end"
        intputType="date"
        inputProps={{
          fullWidth: true,
          variant: 'form',
          value: coupon.couponDuration.end,
          onChange: (e) => {
            setCoupon((prev) => ({
              ...prev,
              couponDuration: {
                ...prev.couponDuration,
                end: e._d,
              },
            }));
          },
        }}
      />
      {/* amount limit */}
      <StyledFormField
        label="Amount limit"
        intputType="text-toggle"
        inputProps={{
          type: 'number',
          name: 'couponAmountLimit',
          value: coupon.couponAmountLimit,
          onChange: commonChangeHandler,
          disabled: !checked.couponAmountLimit,
          checked: checked.couponAmountLimit,
          onToggle: (event) => commonCheckHandler(event, 'couponAmountLimit'),
        }}
      />
      {/* user limit */}
      <StyledFormField
        label="User limit"
        intputType="text-toggle"
        inputProps={{
          type: 'number',
          name: 'couponUserLimit',
          value: coupon.couponUserLimit,
          onChange: commonChangeHandler,
          disabled: !checked.couponUserLimit,
          checked: checked.couponUserLimit,
          onToggle: (event) => commonCheckHandler(event, 'couponUserLimit'),
        }}
      />
      {/* order limit */}
      <StyledFormField
        label="Order limit"
        intputType="text-toggle"
        inputProps={{
          type: 'number',
          name: 'couponOrderLimit',
          value: coupon.couponOrderLimit,
          onChange: commonChangeHandler,
          disabled: !checked.couponOrderLimit,
          checked: checked.couponOrderLimit,
          onToggle: (event) => commonCheckHandler(event, 'couponOrderLimit'),
        }}
      />
      {/* min order */}
      <StyledFormField
        label="Min. Order"
        intputType="text-toggle"
        inputProps={{
          type: 'number',
          name: 'couponMinimumOrderValue',
          value: coupon.couponMinimumOrderValue,
          onChange: commonChangeHandler,
          disabled: !checked.couponMinimumOrderValue,
          checked: checked.couponMinimumOrderValue,
          onToggle: (event) => commonCheckHandler(event, 'couponMinimumOrderValue'),
        }}
      />
      {/* store */}
      <StyledFormField
        label="Store name"
        intputType="autocomplete"
        inputProps={{
          maxHeight: '110px',
          options: shopsOptions,
          value: (coupon?.couponShops && coupon?.couponShops[0]) || null,
          isOptionEqualToValue: (option, value) => option?._id === value?._id,
          getOptionLabel: (option) => option?.shopName,
          sx: {
            flex: 1,
          },
          onChange: (e, v) => {
            setCoupon((prev) => ({ ...prev, couponShops: [v] }));
          },
        }}
      />
      {/* submit */}
      <Box pt={20} pb={6}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DropIcon />}
          disabled={couponMutation?.isLoading}
          fullWidth
          onClick={() => {
            submitCoupon();
          }}
        >
          Save Item
        </Button>
      </Box>
    </SidebarContainer>
  );
}
