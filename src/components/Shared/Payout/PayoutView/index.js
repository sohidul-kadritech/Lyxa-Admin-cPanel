/* eslint-disable no-unused-vars */
import { Button, Modal, Paper, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { ReactComponent as Logo } from '../../../../assets/icons/logo-sm.svg';
import { ReactComponent as LogoText } from '../../../../assets/icons/lyxa-logo-text.svg';
import { useGlobalContext } from '../../../../context';
import { Details } from './Details';
import { ProfitBreakDown } from './ProfitBreakDown';
import RevokePayout from './RevokePayout';
import { getPayoutStatusLabel } from './helpers';

function TopView() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center" gap={4}>
        <Logo />
        <LogoText />
      </Stack>
      <Typography>{moment().format('DD/MM/YYYY')}</Typography>
    </Stack>
  );
}

function PayoutView({ currentPayout, setIsConfirm, onClose }) {
  const { general } = useGlobalContext();
  const { appSetting } = general;

  const [open, setOpen] = useState(false);

  const [addRemoveCreditOpen, setAddRemoveCredit] = useState(false);

  const baseCurrency = appSetting?.baseCurrency?.symbol;
  const secondaryCurrency = appSetting?.secondaryCurrency?.code;

  const currencyForRider =
    currentPayout?.info?.profitBreakdown?.currency === 'secondaryCurrency' ? secondaryCurrency : baseCurrency;

  return (
    <Paper
      sx={{
        width: 'min(96vw, 816px)',
        maxHeight: '96vh',
        padding: '50px',
        margin: '50px 0px',
        overflow: 'auto',
      }}
    >
      <Stack alignContent="space-between" height="100%">
        <Stack flex={1}>
          <TopView currentPayout={currentPayout} />
          <Stack justifyContent="center" alignItems="center" mt={7.5} gap={4} mb={46 / 4}>
            <Typography variant="body2" sx={{ fontSize: '32px', fontWeight: 400 }}>
              Fiscal Payouts
            </Typography>
            <Typography variant="body2" fontSize="14px" fontWeight={400}>
              Payout Number: {currentPayout?.info?.autoGenId}
            </Typography>
          </Stack>

          {/* payout owner information here */}
          <Details currentPayout={currentPayout} />
          {/* Profit breakd down shows here */}
          <ProfitBreakDown
            currentPayout={currentPayout}
            secondaryCurrency={secondaryCurrency}
            currency={currentPayout?.type === 'Rider' ? currencyForRider : baseCurrency}
          />
        </Stack>

        {/* Action button
   here in we check a conditions
   if the payout status is revoked then we will show add remove credit button
   otherwise we show Revoke payment
*/}
        {currentPayout?.info?.payoutStatus !== 'paid' ? (
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={7.5}>
            <Button
              variant="text"
              color="danger"
              disableRipple
              onClick={() => {
                setOpen(true);
              }}
            >
              Revoke Payment
            </Button>

            <Typography variant="body2" fontWeight={500}>
              {getPayoutStatusLabel[currentPayout?.info?.payoutStatus] || 'Unknown'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: '7px' }}
              onClick={() => {
                setIsConfirm(true);
              }}
            >
              Mark as Paid
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="center" alignItems="center" mt={7.5}>
            <Typography variant="body2" fontWeight={500}>
              {getPayoutStatusLabel[currentPayout?.info?.payoutStatus] || 'Unknown'}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Modal open={open}>
        <RevokePayout
          payout={currentPayout?.info}
          closeVeiw={onClose}
          onClose={() => {
            setOpen(false);
          }}
        />
      </Modal>
      {/* <Modal open={addRemoveCreditOpen}>
        <PayoutAddRemoveCredit
          payout={currentPayout?.info}
          closeVeiw={onClose}
          onClose={() => {
            setAddRemoveCredit(false);
          }}
        />
      </Modal> */}
    </Paper>
  );
}

export default PayoutView;
