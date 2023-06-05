import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { isNumber } from 'lodash';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import IncrementDecrementButton from '../ReferFriend/IncrementDecrementButton';
import { discountTypeOptions } from './helpers';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Percentage Settings',
    to: '#',
  },
];

const indexToTypeTracker = {
  0: 'global',
  1: 'seller',
  2: 'delivery',
  3: 'butler',
};
function PercentageSettings2() {
  const [currentTab, setCurrentTab] = useState(0);
  const [globalChargeType, setGlobalChargeType] = useState('percentage');
  const [globalCharge, setGlobalCharge] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState('global');

  const incrementHandler = (setValue) => {
    setValue((prev) => {
      if (isNumber(parseInt(prev, 10)) && prev !== '') return parseInt(prev, 10) + 1;
      if (prev === '') return 1;
      return prev;
    });
  };
  // Handle decremented by one
  const decrementHandler = (setValue) => {
    setValue((prev) => {
      if (isNumber(parseInt(prev, 10)) && prev !== '') return parseInt(prev, 10) - 1;
      if (prev === '' || prev <= 0) return 0;
      return prev;
    });
  };

  // eslint-disable-next-line no-unused-vars
  const getGlobalDropCharge = useQuery([API_URL.GET_DELIVERY_FEE], () => AXIOS.get(API_URL.GET_DELIVERY_FEE), {
    onSuccess: (data) => {
      if (data.status) {
        console.log('====>', data?.data);
      } else {
        console.log('=====> msg: ', data.message);
      }
    },
  });

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
          setType(indexToTypeTracker[newValue]);
          //   setLoading(true);
        }}
      >
        <Tab label="Global"></Tab>
        <Tab label="Seller"></Tab>
        <Tab label="Delivery"></Tab>
        <Tab label="Butler"></Tab>
      </Tabs>

      {type === 'global' ? (
        <Box sx={{ marginTop: '30px' }}>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            sx={{ width: { sm: '100%', md: '80%', lg: '60%' } }}
          >
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                Lyxa charge type
              </Typography>
              <StyledFormField
                intputType="select"
                containerProps={{
                  sx: {
                    // width: '125px',
                  },
                }}
                inputProps={{
                  name: 'discountType',
                  placeholder: 'Lyxa charge type',
                  value: globalChargeType || '',
                  items: discountTypeOptions,
                  //   items: categories,
                  onChange: (e) => {
                    setGlobalChargeType(() => e.target.value);
                  },
                }}
              />
            </Stack>
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                Lyxa charge ({globalChargeType})
              </Typography>
              <IncrementDecrementButton
                currentValue={globalCharge}
                setValue={setGlobalCharge}
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                setTypeValidation={() => console.log('no type')}
              />
            </Stack>
          </Stack>
          {/* add or discard */}
          <Stack flexDirection="row" justifyContent="flex-end" marginTop="30px" gap="20px">
            <Button
              variant="outlined"
              color="primary"
              //   onClick={() => {
              //     if (hasChanged) {
              //       setIsConfirm(true);
              //     } else {
              //       successMsg('Please make a change first!');
              //     }
              //   }}
            >
              Discard
            </Button>
            <Button
              //   onClick={() => {
              //     if (hasChanged) {
              //       updateConfiguration();
              //     } else {
              //       successMsg('Please make a change first!');
              //     }
              //   }}
              variant="contained"
              color="primary"
              //   disabled={updateConfigurationQuery?.isLoading}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ marginTop: '30px' }}>Not Global</Box>
      )}
    </Box>
  );
}

export default PercentageSettings2;
