import { Typography } from '@mui/material';
import React from 'react';
import SidebarContainer from '../../Common/SidebarContainerSm';

function Notification({ onClose }) {
  return (
    <SidebarContainer title="Notificaion" onClose={onClose}>
      <Typography>hello</Typography>
    </SidebarContainer>
  );
}

export default Notification;
