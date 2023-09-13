/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { ReactComponent as Logo } from '../../../../assets/icons/logo-sm.svg';
import { ReactComponent as LogoText } from '../../../../assets/icons/lyxa-logo-text.svg';
import { useGlobalContext } from '../../../../context';
import { getTotalProfit } from '../../FinancialsOverview/helpers';

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

function Details({ currentPayout }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" mt={10}>
      <Stack maxWidth="450px">
        <Typography variant="h4"> Bill to</Typography>
        <Stack mt={2}>
          <Typography>
            {currentPayout?.type} name: {currentPayout?.name}
          </Typography>
          <Typography>Address: {currentPayout?.address}</Typography>
        </Stack>
      </Stack>
      <Stack maxWidth="450px">
        <Typography variant="h4" textAlign="right">
          Details
        </Typography>
        <Stack mt={2}>
          <Typography textAlign="right">Payout Number: {currentPayout?.autoGenId}</Typography>
          <Typography textAlign="right">
            Payout Issue Date: {moment(currentPayout?.info?.createdAt).format('DD/MM/YYYY')}
          </Typography>
          <Typography textAlign="right">
            Billing Period:
            {`${moment(currentPayout?.info?.payoutBillingPeriod?.From).format('DD/MM/YYYY')} - ${moment(
              currentPayout?.payoutBillingPeriod?.To,
            ).format('DD/MM/YYYY')}`}
          </Typography>
          <Typography textAlign="right">
            Due Date:
            {`${moment(currentPayout?.info?.payoutOverDueDate).format('DD/MM/YYYY')}`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

function InfoCardForPayout({ title, value, currency, isNegative, sx, isExpandable, expandSx, showIfZero = false }) {
  const show = Number(value) !== 0 || showIfZero === true;
  return (
    <>
      {show ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            borderBottom: `1px solid #eeeeee`,
            padding: !isExpandable ? '8px 0px' : `8px 0px 8px ${expandSx || '0px'}`,
            ...(sx || {}),
          }}
        >
          <Typography variant="body" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {currency && (
            <Typography
              variant="body"
              sx={{ fontWeight: isExpandable ? 400 : 600, color: isNegative ? 'danger.main' : 'text.primary' }}
            >
              {isNegative ? `- ${currency} ${value}` : `${currency} ${value}`}
            </Typography>
          )}

          {!currency && (
            <Typography
              variant="body"
              sx={{ fontWeight: isExpandable ? 400 : 600, color: isNegative ? 'danger.main' : 'text.primary' }}
            >
              {isNegative ? `- ${value}` : `${value}`}
            </Typography>
          )}
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
}

function RiderProfitBreakDown({ currentPayout, currency }) {
  console.log('currentPayout?.info.profitBreakdown', currentPayout?.info.profitBreakdown);
  const profitBreakdown = currentPayout?.info.profitBreakdown;
  return (
    <Stack>
      <InfoCardForPayout
        title="Total Delivery Fee"
        value={`${currency} ${Math.round(profitBreakdown?.totalDeliveryFee)}`}
      />
      <InfoCardForPayout
        title="Lyxa Delivery Cut"
        isNegative
        value={`${currency} ${Math.round(profitBreakdown?.adminDeliveryProfit)}`}
      />

      <InfoCardForPayout title="Rider Tips" value={`${currency} ${Math.round(profitBreakdown?.riderTips)}`} />

      <InfoCardForPayout
        title="Rider Add/Remove credit"
        value={`${currency} ${Math.round(profitBreakdown?.riderAddRemoveCredit)}`}
      />

      <InfoCardForPayout title="Rider Payout" value={`${currency} ${Math.round(profitBreakdown?.riderPayout)}`} />

      <Stack maxWidth="250px" mt={36 / 4}>
        <InfoCardForPayout
          title={` Total In (${currency})`}
          value={`${currency} ${Math.round(profitBreakdown?.adminDeliveryProfit)}`}
        />
      </Stack>
    </Stack>
  );
}

function ShopProfitBreakdown({ currentPayout, currency, secondaryCurrency }) {
  console.log('currentPayout?.info.profitBreakdown', currentPayout?.info.profitBreakdown);

  const profitBreakdown = currentPayout?.info.profitBreakdown;
  const cash = profitBreakdown?.cash;
  const online = profitBreakdown?.online;
  const lyxaMarketingCashback = profitBreakdown?.AdminMarketingCashback;
  const otherPayments = profitBreakdown?.otherPayments;
  const deliveryFee = profitBreakdown?.deliveryFee;

  const totalProfitJoin = getTotalProfit(
    currency,
    secondaryCurrency,
    profitBreakdown,
    true,
  ).joinBaseAndSecondaryCurrency;

  const totalProfitJoinWithoutBrack = getTotalProfit(
    currency,
    secondaryCurrency,
    profitBreakdown,
    true,
  ).joinBaseAndSecondaryCurrencyWithoutBrackets;

  const totalProfitBase = getTotalProfit(currency, secondaryCurrency, profitBreakdown, true).onlyBaseCurrency;

  return (
    <Stack>
      <InfoCardForPayout
        title="Order Amount"
        currency={currency}
        value={Math.abs(profitBreakdown?.orderAmount || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Cash"
        isExpandable
        expandSx="16px"
        currency={currency}
        value={Math.abs(cash?.totalCash || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Original Order Amount"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.originalOrderAmount_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Discount"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.cash?.discount_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Buy 1 Get 1"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.buy1Get1_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Loyalty Points"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.loyaltyPoints_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Coupons"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.couponDiscount_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Online"
        isExpandable
        expandSx="16px"
        currency={currency}
        value={Math.abs(online?.totalOnline || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Original Order Amount"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.originalOrderAmount_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Discount"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.discount_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Buy 1 Get 1"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.buy1Get1_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Loyalty Points"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.loyaltyPoints_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Coupons"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.couponDiscount_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Lyxa Marketing Compensation"
        isNegative
        currency={currency}
        value={Math.abs(lyxaMarketingCashback?.adminMarketingCashback || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Lyxa fees"
        currency={currency}
        value={Math.abs(profitBreakdown?.adminFees || 0).toFixed(2)}
        isNegative
      />
      <InfoCardForPayout
        title="Lyxa Points cashback"
        currency={currency}
        value={Math.abs(profitBreakdown?.pointsCashback || 0).toFixed(2)}
        isNegative
      />

      <InfoCardForPayout
        title="Other Payments"
        currency={currency}
        value={Math.abs(otherPayments?.totalOtherPayments || 0).toFixed(2)}
        isNegative={otherPayments?.totalOtherPayments >= 0}
      />

      <InfoCardForPayout
        title="Promotion: Free delivery"
        currency={currency}
        isExpandable
        expandSx="16px"
        value={Math.abs(otherPayments?.freeDeliveryByShop || 0).toFixed(2)}
        isNegative
      />
      <InfoCardForPayout
        title="Promotion: Featured"
        currency={currency}
        value={Math.abs(otherPayments?.featuredAmount || 0).toFixed(2)}
        isExpandable
        expandSx="16px"
        isNegative
      />
      <InfoCardForPayout
        title="Error Charge"
        currency={currency}
        value={Math.abs(otherPayments?.errorCharge || 0).toFixed(2)}
        isExpandable
        expandSx="16px"
        isNegative
      />
      <InfoCardForPayout
        title="Shop add/remove credit"
        currency={currency}
        value={Math.abs(otherPayments?.shopAddRemoveCredit || 0).toFixed(2)}
        isExpandable
        expandSx="16px"
        isNegative={otherPayments?.shopAddRemoveCredit < 0}
      />
      <InfoCardForPayout
        title="Refunded Amount"
        currency={currency}
        value={Math.abs(otherPayments?.customerRefund || 0).toFixed(2)}
        isExpandable
        expandSx="16px"
        isNegative
      />
      <InfoCardForPayout
        title="Total VAT"
        currency={currency}
        value={Math.abs(profitBreakdown?.totalVat || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Delivery fee"
        currency={currency}
        value={Math.abs(deliveryFee?.deliveryFee || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Cash"
        isExpandable
        expandSx="16px"
        currency={currency}
        value={Math.abs(deliveryFee?.cash || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Online"
        isExpandable
        expandSx="16px"
        currency={currency}
        value={Math.abs(deliveryFee?.online || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Delivery fee"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(deliveryFee?.online || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Rider tip"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(deliveryFee?.riderTip_online || 0).toFixed(2)}
      />
      <InfoCardForPayout title="Total Payouts" value={`${totalProfitJoin} ${totalProfitBase}`} />

      <Stack maxWidth="450px" mt={36 / 4}>
        <InfoCardForPayout
          sx={{ borderBottom: 'none' }}
          title="Sub Total"
          // currency={currency}
          value={`${totalProfitJoinWithoutBrack} `}
        />

        <InfoCardForPayout
          title="Cash in Hand"
          value={`${currency} ${(profitBreakdown?.baseCurrency_shopCashInHand || 0).toFixed(
            2,
          )} + ${secondaryCurrency} ${profitBreakdown?.secondaryCurrency_shopCashInHand}`}
        />

        <InfoCardForPayout
          sx={{ borderBottom: 'none' }}
          title="Total Payout"
          value={`${currency} ${(profitBreakdown?.baseCurrency_Amount || 0).toFixed(2)} + ${secondaryCurrency} ${
            profitBreakdown?.secondaryCurrency_Amount
          }`}
        />
      </Stack>
    </Stack>
  );
}

function ProfitBreakDown({ currentPayout, currency, secondaryCurrency }) {
  return (
    <Stack>
      <Box mb={52 / 4} mt={56 / 4}>
        <Typography variant="body2">You will be automatically charged for any amount due.</Typography>
      </Box>

      {currentPayout?.type === 'Rider' ? (
        <RiderProfitBreakDown currentPayout={currentPayout} currency={currency} />
      ) : (
        <ShopProfitBreakdown currentPayout={currentPayout} secondaryCurrency={secondaryCurrency} currency={currency} />
      )}
    </Stack>
  );
}

function PayoutView({ currentPayout }) {
  const { general } = useGlobalContext();
  const { appSetting } = general;

  const adminExchangeRate = appSetting?.adminExchangeRate;
  const baseCurrency = appSetting?.baseCurrency?.symbol;
  const secondaryCurrency = appSetting?.secondaryCurrency?.code;

  const currencyForRider = adminExchangeRate > 0 ? secondaryCurrency : baseCurrency;

  console.log('general', appSetting);

  return (
    <Paper
      sx={{
        width: 'min(96vw, 816px)',
        maxHeight: '100vh',
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
              Payout Number: {currentPayout?.autoGenId}
            </Typography>
          </Stack>

          <Details currentPayout={currentPayout} />

          <ProfitBreakDown
            currentPayout={currentPayout}
            secondaryCurrency={secondaryCurrency}
            currency={currentPayout?.type === 'Rider' ? currencyForRider : baseCurrency}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={7.5}>
          <Button variant="text" color="danger" disableRipple>
            Revoke Payment
          </Button>
          <Button variant="contained" color="primary" sx={{ borderRadius: '7px' }}>
            Mark as Paid
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default PayoutView;
