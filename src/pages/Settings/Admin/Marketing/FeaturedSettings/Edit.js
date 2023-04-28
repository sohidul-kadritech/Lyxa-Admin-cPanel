/* eslint-disable no-unused-vars */
import { Box, Button } from '@mui/material';
import React from 'react';
import { ReactComponent as DropIcon } from '../../../../../assets/icons/down.svg';
import SidebarContainer from '../../../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../../../components/Form/StyledFormField';

const fieldContainerSx = {
  padding: '14px 0',
};

export default function EditField({ onClose, editItem }) {
  return (
    <SidebarContainer title="Edit Field" onClose={onClose}>
      <Box position="relative" height="100%">
        {/* duration */}
        <StyledFormField
          label="Duration"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            type: 'text',
            name: 'duration',
            value: editItem.duration,
            readOnly: true,
          }}
        />
        {/* amount */}
        <StyledFormField
          label="Amount"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            type: 'text',
            name: 'amount',
            value: editItem.amount,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            // padding: '20px',
            width: '100%',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<DropIcon />}
            fullWidth
            onClick={() => {}}
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
