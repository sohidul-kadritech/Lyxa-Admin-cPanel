import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import StyledTabs2 from '../../../../Styled/StyledTab2';
import { StyledProfileBox } from '../helpers';
import CouponItem from './CouponItem';

export const marketingSpentTypeOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Used', value: 'used' },
  { label: 'Expired', value: 'expired' },
];

export default function Coupons({ user }) {
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('active');
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  useEffect(() => {
    if (currentTab === 'active') {
      setFilteredCoupons(user?.validCoupons);
    } else if (currentTab === 'used') {
      setFilteredCoupons(user?.usedCouponOrders?.map((order) => order?.couponDetails));
    } else {
      setFilteredCoupons(user?.expiredCoupons);
    }
  }, [currentTab]);

  return (
    <StyledProfileBox
      titleComponent={
        <Stack direction="row" alignContent="center" justifyContent="space-between">
          <Typography variant="body4" display="block" pb={2} fontWeight={600}>
            Coupons
          </Typography>
          <Box
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </Stack>
      }
    >
      <Typography variant="inherit">Total - {filteredCoupons?.length} coupons</Typography>
      {/* collapsed */}
      <Accordion
        expanded={open}
        sx={{
          '&::before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary sx={{ display: 'none' }}></AccordionSummary>
        <AccordionDetails sx={{ padding: '0', paddingTop: '16px' }}>
          <StyledTabs2
            size="small"
            options={marketingSpentTypeOptions}
            value={currentTab}
            onChange={(value) => {
              setCurrentTab(value);
            }}
          />
          <Stack pt={5}>
            {filteredCoupons?.map((coupon, index, { length }) => (
              <CouponItem coupon={coupon} isFirst={index === 0} isLast={index === length - 1} key={index} />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </StyledProfileBox>
  );
}
