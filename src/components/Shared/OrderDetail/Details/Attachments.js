import { Avatar, Box, Modal, Stack, Typography } from '@mui/material';
import { React, useState } from 'react';
import EditDocument from '../../../Common/EditDocument';
import { StyledOrderDetailBox } from '../helpers';

export default function Attachments({ order }) {
  const [open, setOpen] = useState(false);
  const document = { url: order?.leaveAtDoorImage };

  return (
    <>
      <StyledOrderDetailBox title="Attachments">
        <Stack direction="row" alignItems="center" gap={3} pt={1.5}>
          <Box>
            <Avatar src={order?.leaveAtDoorImage} variant="circular" width={36} height={36}>
              I
            </Avatar>
          </Box>
          <Box>
            <Typography
              variant="inherit"
              sx={{ fontSize: '13px', fontWeight: '600', lineHeight: '24px', color: 'primary.main', cursor: 'pointer' }}
              onClick={() => setOpen(true)}
            >
              {order?.leaveAtDoorImage?.slice(-20)}
            </Typography>
          </Box>
        </Stack>
      </StyledOrderDetailBox>
      <Modal open={open} onClose={() => setOpen(false)}>
        <EditDocument document={document} onClose={() => setOpen(false)} previewOnly />
      </Modal>
    </>
  );
}
