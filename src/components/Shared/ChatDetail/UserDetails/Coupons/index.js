import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import StyledTabs2 from '../../../../Styled/StyledTab2';
import { StyledProfileBox } from '../helpers';
import CouponItem from './CouponItem';
import { filterCoupons } from './helpers';

export const marketingSpentTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Used', value: 'used' },
  { label: 'Expired', value: 'expired' },
];

export default function Coupons({ coupons = [] }) {
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);

  console.log(currentTab);

  useEffect(() => {
    setFilteredCoupons(filterCoupons(coupons, currentTab));
    console.log('data', filterCoupons(coupons, currentTab));
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
      <Typography variant="inherit">Total - {coupons?.length} coupons</Typography>
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
