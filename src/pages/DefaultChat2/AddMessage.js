import { ArrowDownward, DeleteForeverOutlined } from '@mui/icons-material';
import { Button, Stack, useTheme } from '@mui/material';
import React, { useState } from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';

// eslint-disable-next-line no-unused-vars
function AddMessage({ onClose, addQuery, isReadOnly, rowData = undefined, isEdit }) {
  const theme = useTheme();
  const [message, setMessage] = useState(rowData?.message || '');
  const addMessageHandler = () => {
    if (!message) {
      successMsg('Please provide message');
    }

    if (!isEdit) {
      addQuery.mutate({ message });
      return;
    }
    addQuery.mutate({ id: rowData?._id, message });
  };
  return (
    <SidebarContainer title={isEdit ? 'Edit Phrase' : isReadOnly ? 'View Phrase' : 'Create Phrase'} onClose={onClose}>
      <Stack justifyContent="space-between" sx={{ marginTop: '20px', paddingBottom: '20px', height: '60vh' }}>
        <StyledFormField
          label="Message *"
          intputType="textarea"
          inputProps={{
            multiline: true,
            type: 'text',
            name: 'title',
            readOnly: isReadOnly,
            value: message,
            onChange: (e) => setMessage(e.target.value),
          }}
        />

        <Stack direction="column" gap="16px" margin="30px 0px" justifyContent="center">
          <Button
            disabled={addQuery?.isLoading || isReadOnly}
            fullWidth
            onClick={addMessageHandler}
            variant="contained"
            startIcon={<ArrowDownward />}
          >
            Save Item
          </Button>
          <Button
            disabled={addQuery?.isLoading || isReadOnly}
            fullWidth
            //   onClick={uploadHanlder}
            disableFocusRipple
            disableRipple
            variant="text"
            sx={{ color: theme.palette.danger.main }}
            startIcon={<DeleteForeverOutlined />}
          >
            Delete Item
          </Button>
        </Stack>
      </Stack>
    </SidebarContainer>
  );
}

export default AddMessage;
