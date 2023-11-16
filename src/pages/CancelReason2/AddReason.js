import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import StyledFormField from '../../components/Form/StyledFormField';
import { validateData } from './helper';

const fieldContainerSx = {
  padding: '14px 0',
};
const reasonTypeOption = [
  { label: 'SHOP', value: 'shopCancel' },
  { label: 'ADMIN', value: 'admin' },
  { label: 'USER', value: 'userCancel' },
  { label: 'USER REFUND', value: 'userRefund' },
  { label: 'BUTLER', value: 'butler' },
  { label: 'RESOLVE CHAT', value: 'resolve' },
  { label: 'SUBSCRIPTION', value: 'subscriptionCancelReason' },
];
const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

const initialReason = {
  type: 'accountSupport',
  question: '',
  ans: '',
  status: 'active',
};

const updateType = (type) => {
  let modifiedType = '';
  if (type === 'shopCancel') {
    modifiedType = 'Shop Order Cancel Reason';
  } else if (type === 'userCancel') {
    modifiedType = 'User Order Cancel Reason';
  } else if (type === 'userRefund') {
    modifiedType = 'User Refund';
  } else if (type === 'butler') {
    modifiedType = 'Butler Order Cancel Reason';
  } else if (type === 'resolve') {
    modifiedType = 'Resolve Chat Reason';
  } else if (type === 'subscriptionCancelReason') {
    modifiedType = 'Subscription Cancel Reason';
  } else {
    modifiedType = 'Admin Order Cancel Reason';
  }
  return modifiedType;
};
function AddReason({ isEdit, onClose, reason, submitHandler, loading }) {
  const [currentReason, setCurrentReason] = useState(reason || initialReason);

  // eslint-disable-next-line no-unused-vars
  const changeHandler = (event) => {
    setCurrentReason((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    console.log('currentFaq', currentReason);
  };

  // eslint-disable-next-line no-unused-vars

  const addNewReason = () => {
    if (validateData(currentReason)) {
      submitHandler(currentReason);
    }
  };

  return (
    <SidebarContainer
      title={`${
        isEdit ? `Edit ${updateType(currentReason?.type) || ''} ` : `Add ${updateType(currentReason?.type) || ''}`
      }`}
      onClose={onClose}
    >
      <Stack direction="column" spacing={5}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: '600',
            fontSize: '15px',
            lineHeight: '18px',
          }}
        >
          Type
        </Typography>
        <OptionsSelect
          items={reasonTypeOption.filter((option) => option.value === currentReason.type)}
          value={currentReason?.type}
          disabled={isEdit}
          onChange={(value) => {
            setCurrentReason((prev) => ({ ...prev, type: value }));
          }}
        />
      </Stack>
      <StyledFormField
        label="Reason *"
        intputType="text"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          value: currentReason?.name,
          type: 'text',
          name: 'name',
          onChange: changeHandler,
        }}
      />
      {isEdit && (
        <StyledFormField
          label="Status *"
          intputType="select"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            name: 'status',
            value: currentReason?.status || '',
            items: statusOptions,
            onChange: changeHandler,
          }}
        />
      )}
      <Box marginTop="30px">
        <Button
          disableElevation
          variant="contained"
          fullWidth
          disabled={loading}
          //   disabled={(isEdit && !currentFaq?._id) || isFaqLoading || isChatReasonLoading}
          onClick={() => {
            addNewReason();
          }}
        >
          {isEdit ? 'Save' : 'Add'}
        </Button>
      </Box>
    </SidebarContainer>
  );
}

export default AddReason;
