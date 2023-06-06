import { Button } from '@mui/material';
import React, { useState } from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { validateRange } from './helpers';

const initialData = {
  from: 0,
  to: 0,
  charge: 0,
  deliveryPersonCut: 0,
};

// eslint-disable-next-line no-unused-vars
function AddRange({ onClose, allData, callForUpdate, isLoading }) {
  const [currentData, setCurrentData] = useState(initialData);
  const changeHandler = (e) => setCurrentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmitHandler = () => {
    console.log(currentData);
    if (validateRange(allData, currentData)) {
      callForUpdate(currentData);
    }
  };
  return (
    <SidebarContainer title={`${'Add Range'}`} onClose={onClose}>
      <StyledFormField
        label="Range From *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          name: 'from',
          type: 'number',
          placeholder: 'Enter Delivery Range From...',
          value: currentData?.from || '',
          onChange: changeHandler,
        }}
      />
      <StyledFormField
        label="Range To *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          name: 'to',
          type: 'number',
          placeholder: 'Enter Delivery Range To...',
          value: currentData?.to || '',
          onChange: changeHandler,
        }}
      />
      <StyledFormField
        label="Charge *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          name: 'charge',
          type: 'number',
          placeholder: 'Enter Lyxa Charge...',
          value: currentData?.charge || '',
          onChange: changeHandler,
        }}
      />
      <StyledFormField
        label="Rider Fee Cut *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          name: 'deliveryPersonCut',
          type: 'number',
          placeholder: 'Enter Rider Fee Cut...',
          value: currentData?.deliveryPersonCut || '',
          onChange: changeHandler,
        }}
      />
      <Button
        sx={{ marginTop: '30px' }}
        disableElevation
        variant="contained"
        fullWidth
        disabled={isLoading}
        onClick={() => {
          onSubmitHandler();
        }}
      >
        Add
      </Button>
    </SidebarContainer>
  );
}

export default AddRange;
