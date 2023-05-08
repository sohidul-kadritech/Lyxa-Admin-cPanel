// thrid party
import { Box, Button } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ReactComponent as DropIcon } from '../../../../../../assets/icons/down.svg';
import SidebarContainer from '../../../../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../../../../components/Form/StyledFormField';
import { successMsg } from '../../../../../../helpers/successMsg';
import * as Api from '../../../../../../network/Api';
import AXIOS from '../../../../../../network/axios';
import PageLoader from './PageLoader';
import {
  checkedInit,
  couponDiscountTypeOptions,
  couponTypeToTitleMap,
  createCouponUploaData,
  getCouponEditdData,
  getCouponInit,
  getEditCouponChecked,
  validateCoupon,
} from './helpers';

export default function AddCoupon({ onClose, couponType, editCoupon }) {
  const queryClient = useQueryClient();

  const [coupon, setCoupon] = useState(editCoupon?._id ? getCouponEditdData(editCoupon) : getCouponInit(couponType));
  const [checked, setChecked] = useState(editCoupon?._id ? getEditCouponChecked(editCoupon) : { ...checkedInit });

  // handlers
  const commonChangeHandler = (e) => {
    setCoupon((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const commonCheckHandler = (event, property) => {
    setChecked((prev) => ({ ...prev, [property]: event.target.checked }));
  };

  // shops query
  const shopsQuery = useQuery([Api.ALL_SHOP, { type: 'all', page: 1, pageSize: 200 }], () =>
    AXIOS.get(Api.ALL_SHOP, {
      params: {
        type: 'all',
        shopStatus: 'all',
        page: 1,
        pageSize: 200,
      },
    })
  );

  const shopsOptions = shopsQuery?.data?.data?.shops || [];

  // shops query
  const usersQuery = useQuery([Api.ALL_USERS, { type: 'all' }], () =>
    AXIOS.get(Api.ALL_USERS, {
      params: {
        page: 1,
        pageSize: 200,
        searchKey: '',
        sortBy: 'desc',
        status: 'all',
      },
    })
  );

  // coupon add
  const couponMutation = useMutation(
    (data) => {
      const _api = editCoupon?._id ? Api.UPDATE_COUPON : Api.ADD_COUPON;
      return AXIOS.post(_api, {
        ...data,
        id: editCoupon?._id,
      });
    },
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : undefined);
        if (data?.status) {
          onClose();
          queryClient.invalidateQueries([Api.GET_COUPON]);
        }
      },
    }
  );

  const submitCoupon = () => {
    const valid = validateCoupon(coupon, couponType);

    if (!valid.status) {
      successMsg(valid?.message);
      return;
    }

    const couponData = createCouponUploaData(coupon, checked, couponType);
    couponMutation.mutate(couponData);
  };

  const autoGenCodeQuery = useQuery([Api.GET_AUTO_GEN_COUPON_CODE], () => AXIOS.get(Api.GET_AUTO_GEN_COUPON_CODE), {
    enabled: false,
    onSuccess: (data) => {
      setCoupon((prev) => ({ ...prev, couponName: data?.data?.couponName || prev?.couponName }));
    },
  });

  const __loading = shopsQuery.isLoading || usersQuery.isLoading;

  return (
    <SidebarContainer title={`Generate Coupon: ${couponTypeToTitleMap[couponType]}`} onClose={onClose}>
      {__loading ? (
        <PageLoader />
      ) : (
        <>
          {/* name */}
          <Box position="relative">
            <StyledFormField
              label="Name"
              intputType="text"
              inputProps={{
                type: 'text',
                name: 'couponName',
                value: coupon.couponName,
                disabled: autoGenCodeQuery.isFetching,
                onChange: commonChangeHandler,
                sx: {
                  textTransform: 'uppercase',
                  paddingRight: '105px',
                },
              }}
            />
            <Button
              variant="text"
              sx={{ fontWeight: 600, position: 'absolute', right: '20px', top: '49px' }}
              onClick={autoGenCodeQuery.refetch}
            >
              Generate
            </Button>
          </Box>
          {/* user */}
          {couponType === 'individual_user' && (
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
          )}
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
              maxDate: moment(coupon?.couponDuration?.end).subtract(1, 'day'),
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
              minDate: moment(coupon?.couponDuration?.start).add(1, 'day'),
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
          {couponType === 'individual_store' && (
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
          )}

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
        </>
      )}
    </SidebarContainer>
  );
}
