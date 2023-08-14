import { Button, Modal, Stack } from '@mui/material';
import { React, useState } from 'react';
import AddRemoveCredit from '../../../../pages/UsersProfile/Transactions/AddRemoveCredit';
import AccountInformation from './AccountInformation';
import Address from './Address';
import Coupons from './Coupons';
import CreditCards from './CreditCards';
import LastOrders from './LastOrders';
import Transactions from './Transactions';

export default function UserDetails({ user }) {
  const [modalOpen, setModalOpen] = useState(false);

  console.log({ user });

  return (
    <Stack gap={5} pb={2.5}>
      <AccountInformation user={user} />
      <CreditCards cards={user?.cards} />
      <Address addressList={user?.address} />
      <Coupons coupons={user?.coupons} />
      <Transactions userId={user?._id} />
      <LastOrders user={user?._id} />
      <Stack direction="row" gap={5} pt={2.5}>
        <Button variant="outlined" fullWidth onClick={() => setModalOpen(true)}>
          Add Credit / Remove Credit
        </Button>
      </Stack>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <AddRemoveCredit
          userId={user?._id}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </Modal>
    </Stack>
  );
}
