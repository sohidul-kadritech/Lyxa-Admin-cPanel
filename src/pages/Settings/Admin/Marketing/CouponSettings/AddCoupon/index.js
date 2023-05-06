// thrid party
import { useState } from 'react';
import SidebarContainer from '../../../../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../../../../components/Form/StyledFormField';
import { couponDiscountTypeOptions, couponTypeToTitleMap, getCouponInit } from './helpers';

export default function AddCoupon({ onClose, couponType }) {
  const [coupon, setCoupon] = useState(getCouponInit(couponType));

  const commonChangeHandler = (e) => {
    setCoupon((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
          type: 'text',
          name: 'couponName',
          value: coupon.couponName,
          onChange: commonChangeHandler,
        }}
      />
    </SidebarContainer>
  );
}
