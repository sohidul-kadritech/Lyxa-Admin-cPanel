/* eslint-disable no-unused-vars */
import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as DropIcon } from '../../../../../assets/icons/down.svg';
import SidebarContainer from '../../../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../../../components/Form/StyledFormField';
import { successMsg } from '../../../../../helpers/successMsg';

export default function EditField({ onClose, editField, updateField, loading }) {
  const [field, setField] = useState(editField);

  const commonChangeHandler = (event) => {
    setField((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = () => {
    if (field?.featuredAmount < 1) {
      successMsg('Amount can be less than 1!');
      return;
    }

    updateField(field, 'amount');
  };

  return (
    <SidebarContainer title="Edit Field" onClose={onClose}>
      <Box position="relative" height="100%">
        {/* duration */}
        <StyledFormField
          label="Duration"
          intputType="text"
          inputProps={{
            type: 'number',
            name: 'duration',
            value: field.featuredWeeklyDuration,
            readOnly: true,
          }}
        />
        {/* amount */}
        <StyledFormField
          label="Amount"
          intputType="text"
          inputProps={{
            type: 'number',
            name: 'featuredAmount',
            value: field?.featuredAmount,
            onChange: commonChangeHandler,
          }}
        />
        <Box pt={5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DropIcon />}
            fullWidth
            disabled={loading}
            onClick={onSubmit}
            sx={{
              marginTop: '14px',
            }}
          >
            Save Item
          </Button>
        </Box>
      </Box>
    </SidebarContainer>
  );
}
