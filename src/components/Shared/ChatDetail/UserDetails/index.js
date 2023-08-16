import { Button, Modal, Stack } from '@mui/material';
import { React, useState } from 'react';
import { useQuery } from 'react-query';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import AddRemoveCredit from '../../../../pages/UsersProfile/Transactions/AddRemoveCredit';
import AccountInformation from './AccountInformation';
import Address from './Address';
import Coupons from './Coupons';
import CreditCards from './CreditCards';
import LastOrders from './LastOrders';
import Transactions from './Transactions';

export default function UserDetails({ chat }) {
  let user = chat?.user;
  const [modalOpen, setModalOpen] = useState(false);

  useQuery(
    [Api.SINGLE_USER, { id: user?._id }],
    () =>
      AXIOS.get(Api.SINGLE_USER, {
        params: { id: user?._id },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          chat.user = data?.data?.user;
          user = data?.data?.user;
        }
      },
    }
  );

  return (
    <Stack gap={5} pb={2.5}>
      <AccountInformation user={user} />
      <CreditCards cards={user?.cards} />
      <Address addressList={user?.address} />
      <Coupons user={user} />
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
