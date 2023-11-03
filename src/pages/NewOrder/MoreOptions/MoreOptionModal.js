/* eslint-disable no-unused-vars */
import { Box, Modal, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as RejectIcon } from '../../../assets/icons/close.svg';
import { ReactComponent as ContactSupporIcon } from '../../../assets/icons/headphone.svg';
import { ReactComponent as ClockIcon } from '../../../assets/icons/history.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/icons/settings.svg';
import CloseButton from '../../../components/Common/CloseButton';
import AdjustOrderForShop from './AdjustOrder';
import OptionsCards from './OptionsCards';

const intialModal = { delayOrder: false, adjustOrder: false, contactRider: false, rejectOrder: false };

function MoreOptionModal({ currentOrder, onClose }) {
  const [modal, setModal] = useState(intialModal);
  const options = [
    {
      icon: <ClockIcon style={{ width: '32px', height: '32px' }} />,
      name: 'Delay Order',
      onClick: () => {
        console.log('on click delay order');
        setModal((prev) => ({ ...prev, delayOrder: true }));
      },
    },
    {
      icon: <SettingsIcon style={{ width: '32px', height: '32px' }} />,
      name: 'Adjust Order',
      onClick: () => {
        console.log('on click adjust order');
        setModal((prev) => ({ ...prev, adjustOrder: true }));
      },
    },
    {
      icon: <ContactSupporIcon style={{ width: '32px', height: '32px' }} />,
      name: 'Contact Rider',
      onClick: () => {
        console.log('on click contact order');
        setModal((prev) => ({ ...prev, contactRider: true }));
      },
    },
    {
      icon: <RejectIcon style={{ width: '32px', height: '32px' }} />,
      name: 'Reject Order',
      onClick: () => {
        console.log('on click reject order');
        setModal((prev) => ({ ...prev, rejectOrder: true }));
      },
    },
  ];
  return (
    <Paper
      sx={{
        minWidth: 'max(60vw, 550px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
        background: '#fff',
      }}
    >
      <Box sx={{ padding: 5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3">More options: Order # {currentOrder?.orderId}</Typography>

          <CloseButton
            onClick={() => {
              onClose();
            }}
          />
        </Stack>
        <Stack>
          {options?.map((option, index) => (
            <OptionsCards option={option} key={index} />
          ))}
        </Stack>
      </Box>

      <Modal
        open={modal?.adjustOrder}
        onClose={() => {
          setModal((prev) => ({ ...prev, adjustOrder: false }));
        }}
        sx={{ zIndex: '1250 !important' }}
      >
        <AdjustOrderForShop
          currentOrder={currentOrder}
          onClose={() => {
            setModal((prev) => ({ ...prev, adjustOrder: false }));
          }}
        />
      </Modal>
    </Paper>
  );
}

export default MoreOptionModal;
