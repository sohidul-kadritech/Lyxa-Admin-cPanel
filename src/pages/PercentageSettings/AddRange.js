import { Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { getInitialDataForAddRange, validateEditeCharge, validateRange } from './helpers';

// eslint-disable-next-line no-unused-vars
function AddRange({ onClose, allData, callForUpdate, editedData, isEdit, isLoading }) {
  const theme = useTheme();
  const [currentData, setCurrentData] = useState(getInitialDataForAddRange(editedData));
  const [oldData] = useState(getInitialDataForAddRange(editedData));
  const changeHandler = (e) => setCurrentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmitHandler = () => {
    console.log(currentData);

    if (isEdit) {
      if (isEdit && validateEditeCharge(allData, currentData, oldData)) {
        callForUpdate(currentData);
        return;
      }

      return;
    }

    if (validateRange(allData, currentData)) {
      callForUpdate(currentData);
    }
  };
  return (
    <SidebarContainer title={`${isEdit ? 'Edit Range' : 'Add Range'}`} onClose={onClose}>
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
          readOnly: isEdit,
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
          readOnly: isEdit,
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

      <Stack sx={{ marginTop: '30px' }}>
        {isEdit && (
          <Typography
            sx={{ fontSize: '15px', color: theme.palette.text.secondary, fontWeight: 500, margin: '0px 0px 16px 0px' }}
          >
            *Only Lyxa Charge and Rider fee can be editable.
          </Typography>
        )}
        <Button
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
      </Stack>
    </SidebarContainer>
  );
}

export default AddRange;
