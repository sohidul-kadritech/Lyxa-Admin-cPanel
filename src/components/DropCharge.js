import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { successMsg } from '../helpers/successMsg';
import { addSellerCharge } from '../store/Seller/sellerAction';
import { addPercentage } from '../store/Settings/settingsAction';

function DropCharge({ chargeType, chargeValue, type, seller = null }) {
  const dispatch = useDispatch();

  const [feeInfo, setFeeInfo] = useState({
    dropPercentageType: '',
    dropPercentage: '',
  });
  const { loading } = useSelector((state) => state.settingsReducer);

  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chargeType || chargeValue) {
      setFeeInfo({
        ...feeInfo,
        dropPercentageType: chargeType,
        dropPercentage: chargeValue,
      });
    }
  }, [chargeType, chargeValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeeInfo({ ...feeInfo, [name]: value });
  };

  // VALIDATION
  // eslint-disable-next-line consistent-return
  const deliveryFeeSubmit = () => {
    const { dropPercentageType, dropPercentage } = feeInfo;
    if (!dropPercentageType) {
      return successMsg('Enter delivery charge type');
    }
    if (!dropPercentage) {
      return successMsg('Enter Lyxa charge');
    }
    // eslint-disable-next-line no-use-before-define
    submitData();
  };
  // SUBMTI DATA TO SERVER
  const submitData = () => {
    if (type === 'global') {
      dispatch(
        addPercentage({
          ...feeInfo,
        })
      );
    } else {
      dispatch(addSellerCharge({ ...feeInfo, sellerId: seller }));
    }
  };

  return (
    <Stack spacing={2} direction="row">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Lyxa Charge Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name="dropPercentageType"
          value={feeInfo.dropPercentageType}
          label="Lyxa Charge Type"
          onChange={handleChange}
          required
        >
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="percentage">Percentage</MenuItem>
        </Select>
      </FormControl>
      <TextField
        style={{ width: '100%' }}
        label={`Lyxa Charge (${feeInfo.dropPercentageType === 'amount' ? 'Amount' : 'Percentage'})`}
        variant="outlined"
        placeholder="Enter Lyxa Charge"
        name="dropPercentage"
        value={feeInfo.dropPercentage}
        onChange={handleChange}
        type="number"
        required
      />
      <Button
        disabled={loading}
        style={{ width: '20%', backgroundColor: '#313131', color: 'white' }}
        onClick={deliveryFeeSubmit}
      >
        {loading ? 'Loading...' : 'Update'}
      </Button>
    </Stack>
  );
}

export default DropCharge;
