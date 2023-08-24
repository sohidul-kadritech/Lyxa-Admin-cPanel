/* eslint-disable prettier/prettier */
// thrid party
import { Box, Button } from '@mui/material';
import { debounce } from '@mui/material/utils';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import {
  checkedInit,
  couponDiscountTypeOptions,
  couponShopTypeOptions,
  couponTypeToTitleMap,
  createCouponUploaData,
  getCouponEditdData,
  getCouponInit,
  getEditCouponChecked,
  validateCoupon,
} from './helpers';

export default function AddCoupon({ onClose, couponType, editCoupon }) {
  const queryClient = useQueryClient();
  const [render, setRender] = useState(false);

  const [coupon, setCoupon] = useState(editCoupon?._id ? getCouponEditdData(editCoupon) : getCouponInit(couponType));
  const [checked] = useState(editCoupon?._id ? getEditCouponChecked(editCoupon) : { ...checkedInit });
  const [shopSearchKey, setShopSearchKey] = useState('');
  const [userSearchKey, setUserSearchKey] = useState('');
  const [shopOptions, setShopOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  console.log('checked', getEditCouponChecked(editCoupon));

  // handlers
  const commonChangeHandler = (e) => {
    setCoupon((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // shops query
  const shopsQuery = useMutation(
    () =>
      AXIOS.get(Api.ALL_SHOP, {
        params: {
          type: 'all',
          shopStatus: 'all',
          page: 1,
          pageSize: 15,
          searchKey: shopSearchKey,
        },
      }),
    {
      onSuccess: (data) => {
        setShopOptions((prev) => data?.data?.shops || prev);
      },
    },
  );

  const getShops = useMemo(
    () =>
      debounce((value) => {
        setShopSearchKey(value);
        shopsQuery.mutate();
      }, 300),
    [],
  );

  const usersQuery = useMutation(
    () =>
      AXIOS.get(Api.ALL_USERS, {
        params: {
          page: 1,
          pageSize: 15,
          searchKey: userSearchKey,
          sortBy: 'desc',
          status: 'all',
        },
      }),
    {
      onSuccess: (data) => {
        console.log(data?.data?.users);
        setUserOptions((prev) => data?.data?.users || prev);
      },
    },
  );

  const getUsers = useMemo(
    () =>
      debounce((value) => {
        setUserSearchKey(value);
        usersQuery.mutate();
      }, 300),
    [],
  );

  // coupon add
  const couponMutation = useMutation(
    (data) => {
      const _api = editCoupon?._id ? Api.UPDATE_COUPON : Api.ADD_COUPON;
      return AXIOS.post(_api, {
        ...data,
        // for new coupons, "id" becomes undefined and doesn't make any effects
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
    },
  );

  const submitCoupon = () => {
    const valid = validateCoupon(coupon, couponType);

    if (!valid.status) {
      successMsg(valid?.message);
      return;
    }

    const couponData = createCouponUploaData(coupon, checked);
    couponMutation.mutate(couponData);
  };

  const autoGenCodeQuery = useQuery([Api.GET_AUTO_GEN_COUPON_CODE], () => AXIOS.get(Api.GET_AUTO_GEN_COUPON_CODE), {
    enabled: false,
    onSuccess: (data) => {
      setCoupon((prev) => ({ ...prev, couponName: data?.data?.couponName || prev?.couponName }));
    },
  });

  return (
    <SidebarContainer title={`Generate Coupon: ${couponTypeToTitleMap[couponType]}`} onClose={onClose}>
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
              onChange: (e) => {
                if (e?.target?.value?.length > 6) return;
                commonChangeHandler(e);
              },
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
            disableRipple
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
              options: userOptions,
              value: (coupon?.couponUsers && coupon?.couponUsers[0]) || null,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              getOptionLabel: (option) => option?.name,
              sx: {
                flex: 1,
              },
              onChange: (e, v) => {
                setCoupon((prev) => ({ ...prev, couponUsers: [v] }));
              },
              onInputChange: (e) => {
                getUsers(e?.target?.value);
              },
            }}
          />
        )}

        {/* cupon influencer */}
        {couponType === 'custom_coupon' && (
          <StyledFormField
            label="Influencer Name"
            intputType="autocomplete"
            inputProps={{
              maxHeight: '300px',
              options: userOptions,
              value: coupon?.couponInfluencer || null,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'Type influencer name',
              getOptionLabel: (option) => option?.name,
              sx: {
                flex: 1,
              },
              onChange: (e, v) => {
                setCoupon((prev) => ({ ...prev, couponInfluencer: v }));
              },
              onInputChange: (e) => {
                getUsers(e?.target?.value);
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

        {/* max discount  */}
        {coupon.couponDiscountType === 'percentage' && (
          <StyledFormField
            label="Maximum discount amount"
            intputType="text-toggle"
            inputProps={{
              type: 'number',
              name: 'couponMaximumDiscountLimit',
              value: coupon.couponMaximumDiscountLimit,
              onChange: commonChangeHandler,
              disabled: !checked.couponMaximumDiscountLimit,
              checked: checked.couponMaximumDiscountLimit,
              onToggle: () => {
                checked.couponMaximumDiscountLimit = !checked.couponMaximumDiscountLimit;
                setRender(!render);
              },
            }}
          />
        )}

        {/* value */}
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
            onToggle: () => {
              checked.couponAmountLimit = !checked.couponAmountLimit;
              setRender(!render);
            },
          }}
        />

        {/* user limit */}
        <StyledFormField
          label="Order Limit Per User"
          intputType="text-toggle"
          inputProps={{
            type: 'number',
            name: 'couponUserLimit',
            value: coupon.couponUserLimit,
            onChange: commonChangeHandler,
            disabled: !checked.couponUserLimit,
            checked: checked.couponUserLimit,
            onToggle: () => {
              checked.couponUserLimit = !checked.couponUserLimit;
              setRender(!render);
            },
          }}
        />

        {/* order limit */}
        {couponType !== 'individual_user' && (
          <StyledFormField
            label="Total Order Limit"
            intputType="text-toggle"
            inputProps={{
              type: 'number',
              name: 'couponOrderLimit',
              value: coupon.couponOrderLimit,
              onChange: commonChangeHandler,
              disabled: !checked.couponOrderLimit,
              checked: checked.couponOrderLimit,
              onToggle: () => {
                checked.couponOrderLimit = !checked.couponOrderLimit;
                setRender(!render);
              },
            }}
          />
        )}

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
            onToggle: () => {
              checked.couponMinimumOrderValue = !checked.couponMinimumOrderValue;
              setRender(!render);
            },
          }}
        />

        {/* type */}
        {couponType !== 'global' && (
          <StyledFormField
            label="Shop Category"
            intputType="select"
            inputProps={{
              name: 'couponShopTypes',
              value: coupon.couponShopTypes,
              items: couponShopTypeOptions,
              onChange: (event) => {
                commonChangeHandler(event);
                setCoupon((prev) => ({
                  ...prev,
                  couponShops: prev?.couponShops?.filter((shop) => !event?.target?.value?.includes(shop?.shopType)),
                }));
              },
              multiple: true,
              renderValue: (seleted) =>
                seleted
                  ?.map((value) => couponShopTypeOptions?.find((option) => option?.value === value)?.label)
                  .join(', '),
            }}
          />
        )}

        {couponType === 'individual_store' && !coupon?.couponShopTypes?.length && (
          <StyledFormField
            label="Stores"
            intputType="autocomplete"
            inputProps={{
              multiple: true,
              maxHeight: '110px',
              options: shopOptions,
              value: coupon?.couponShops || [],
              label: 'Choose',
              disablePortal: true,
              noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No shops',
              getOptionLabel: (option) => option?.shopName,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              onChange: (e, v) => {
                setCoupon((prev) => ({ ...prev, couponShops: v.map((item) => item) }));
              },
              onInputChange: (e) => {
                getShops(e?.target?.value);
              },
              sx: {
                '& .MuiFormControl-root': {
                  minWidth: '100px',
                },
              },
            }}
          />
        )}

        {/* multiple shops */}
        {couponType !== 'global' && couponType !== 'individual_store' && (
          <StyledFormField
            label="Custom Shops"
            intputType="autocomplete"
            inputProps={{
              multiple: true,
              maxHeight: '110px',
              options: shopOptions?.filter((shop) => !coupon?.couponShopTypes?.includes(shop?.shopType)),
              value: coupon?.couponShops || [],
              label: 'Choose',
              noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No shops',
              getOptionLabel: (option) => option?.shopName,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              onChange: (e, v) => {
                setCoupon((prev) => ({ ...prev, couponShops: v.map((item) => item) }));
              },
              onInputChange: (e) => {
                getShops(e?.target?.value);
              },
              sx: {
                '& .MuiFormControl-root': {
                  minWidth: '100px',
                },
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
    </SidebarContainer>
  );
}
