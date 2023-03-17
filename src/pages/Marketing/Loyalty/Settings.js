/* eslint-disable no-unused-vars */
// third party
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

// project import
import StyledAccordion from '../../../components/Styled/StyledAccordion';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import StyledTable2 from '../../../components/Styled/StyledTable2';

const products = [
  {
    label: 'Vegan Burger',
    value: 'vegan-burger',
  },
  {
    label: 'Vegan Sandwitch',
    value: 'vegan-sandwitch',
  },
];

const rewardBundles = [20, 30, 40, 50, 60];
const rewardCategories = ['Mood Booster', 'Late Night', 'Couple Dinner'];

const data = [
  {
    id: 1,
    product: {
      label: 'Vegan Burger',
      value: 'vegan-burger',
      price: 30,
    },
    rewardBundle: 20,
    rewardCategory: 'Mood Booster',
  },
];

const itemSelectOptions = [
  { label: 'Selected Items', value: 'multiple' },
  { label: 'Entire Menu', value: 'all' },
];

function ItemsTitle() {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" gap={2.5}>
      <Typography
        variant="body1"
        color={theme.palette.text.heading}
        sx={{
          lineHeight: '19px',
          fontWeight: 600,
        }}
      >
        Items
      </Typography>
      <span
        style={{
          fontWeight: '500',
          fontSize: '11px',
          lineHeight: '20px',
          color: theme.palette.primary.main,
        }}
      >
        Required
      </span>
    </Stack>
  );
}

// project import
export default function LoyaltySettings() {
  const theme = useTheme();
  const [currentExpanedTab, seCurrentExpanedTab] = useState(0);

  const columns = [
    {
      id: 1,
      headerName: `Item`,
      sortable: false,
      field: 'product',
      flex: 2,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => <Typography variant="body1">Items</Typography>,
    },
    {
      id: 2,
      headerName: `Point Percentage`,
      sortable: false,
      field: 'rewardBundle',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => <Typography variant="body1">Point Percentage</Typography>,
    },
    {
      id: 3,
      headerName: `Category`,
      sortable: false,
      field: 'rewardCategory',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => <Typography variant="body1">Category</Typography>,
    },
    {
      id: 4,
      headerName: `Final Price`,
      sortable: false,
      field: '',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => <Typography variant="body1">Final Price</Typography>,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 305px',
      }}
    >
      {/* left */}
      <Box
        sx={{
          padding: '36px',
          borderRight: `1px solid ${theme.palette.custom.border}`,
        }}
      >
        <Typography variant="h4" pb={3}>
          Loyalty Program
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary2}>
          Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on
          an item, giving them more incentive to order from your business.
        </Typography>
        {/* tabs */}
        <StyledAccordion
          Title={<ItemsTitle />}
          isOpen={currentExpanedTab === 0}
          onChange={(closed) => {
            seCurrentExpanedTab(closed ? 0 : -1);
          }}
        >
          <StyledRadioGroup items={itemSelectOptions} />
          {/* product table */}
          <StyledTable2 columns={columns} rows={data} />
        </StyledAccordion>
      </Box>
      {/* right */}
      <Box
        sx={{
          padding: '36px',
        }}
      >
        Fist Side
      </Box>
    </Box>
  );
}
