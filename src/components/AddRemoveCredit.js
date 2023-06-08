import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'reactstrap';
import { successMsg } from '../helpers/successMsg';
import { shopAddRemoveCredit } from '../store/appWallet/appWalletAction';

function AddRemoveCredit({ userType, id, dropAmount, userAmount }) {
  const { loading } = useSelector((state) => state.appWalletReducer);

  console.log(dropAmount, userAmount);

  const dispatch = useDispatch();

  const [amount, setAmount] = useState('');
  const [typeOfCredit, setTypeOfCredit] = useState('');
  const [desc, setDesc] = useState('');

  const submitData = () => {
    if (userType === 'shop') {
      dispatch(shopAddRemoveCredit({ shopId: id, amount, type: typeOfCredit, desc }));
    }
  };

  // eslint-disable-next-line consistent-return
  const submitCredit = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      return successMsg('Please enter a valid amount', 'error');
    }
    if (typeOfCredit === '') {
      return successMsg('Please select a type of credit', 'error');
    }
    if (typeOfCredit === '') {
      return successMsg('Please select a type of credit', 'error');
    }
    if ((typeOfCredit === 'add' && amount > dropAmount) || (typeOfCredit === 'remove' && amount > userAmount)) {
      return successMsg("You don't have enough credit", 'error');
    }
    submitData();
  };

  return (
    <div>
      <Form className="mb-4" onSubmit={submitCredit}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            row
            onChange={(e) => setTypeOfCredit(e.target.value)}
            name="radio-buttons-group"
          >
            <FormControlLabel value="add" control={<Radio />} label="Add" />
            <FormControlLabel value="remove" control={<Radio />} label="Remove" />
          </RadioGroup>
        </FormControl>

        <TextField
          style={{ width: '100%' }}
          id="outlined-basic"
          label="Amount"
          type="number"
          variant="outlined"
          placeholder="Enter amount"
          className="mt-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <TextField
          style={{ width: '100%' }}
          id="outlined-basic"
          label="Description"
          type="text"
          variant="outlined"
          placeholder="Enter description"
          className="mt-2"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="mt-3 d-flex justify-content-end">
          <Button type="submit" color="success" disabled={loading}>
            {loading ? 'Submitting..' : 'Submit'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AddRemoveCredit;
