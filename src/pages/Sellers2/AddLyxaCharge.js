import { Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { discountTypeOptions } from '../PercentageSettings/helpers';

const init = {
  dropPercentageType: 'percentage',
  dropPercentage: '',
};
// eslint-disable-next-line no-unused-vars
function AddLyxaCharge({ onClose, sellerDropChargeQuery, currentSeller }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const [currentLyxaCharge, setCurrentLyxaCharge] = useState({ ...init });

  const changeHandler = (e) => {
    setCurrentLyxaCharge((prev) => {
      console.log({ ...prev, [e.target.name]: e.target.value });
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const onSubmitDropCharge = () => {
    if (!currentLyxaCharge?.dropPercentageType) {
      successMsg('Select lyxa charge type');
      return;
    }
    if (!currentLyxaCharge?.dropPercentage) {
      successMsg('Provide lyxa charge');
      return;
    }

    console.log('successfully update');
    sellerDropChargeQuery.mutate({
      ...currentLyxaCharge,
      sellerId: currentSeller?._id,
    });
  };

  const globalDropChargeQuery = useQuery([Api.GET_DELIVERY_FEE], () => AXIOS.get(Api.GET_DELIVERY_FEE));

  const globalCharge = globalDropChargeQuery?.data?.data?.charge?.dropPercentage;
  const globalChargeType = globalDropChargeQuery?.data?.data?.charge?.dropPercentageType;

  return (
    <SidebarContainer title="Add Lyxa Charge" onClose={onClose}>
      <Stack>
        <StyledFormField
          label="Lyxa Charge Type *"
          intputType="select"
          containerProps={{
            sx: { padding: '14px 0' },
          }}
          inputProps={{
            placeholder: 'Lyxa Charge Type',
            value: currentLyxaCharge?.dropPercentageType || '',
            name: 'dropPercentageType',
            items: discountTypeOptions,
            onChange: changeHandler,
            readOnly: true,
          }}
        />
        <StyledFormField
          label="Lyxa charge *"
          intputType="text"
          containerProps={{
            sx: { padding: '14px 0' },
          }}
          inputProps={{
            value: currentLyxaCharge?.dropPercentage,
            placeholder: 'Lyxa charge',
            type: 'number',
            name: 'dropPercentage',
            onChange: changeHandler,
          }}
        />
        <Typography variant="body3" color="text.secondary2">
          Global Charge is currently {globalChargeType !== 'percentage' ? `${currency}` : ''}
          {globalCharge || 0}
          {globalChargeType === 'percentage' ? `%` : ''}
        </Typography>
      </Stack>
      <Stack sx={{ padding: '30px 0px' }}>
        <Button
          disableElevation
          variant="contained"
          disabled={sellerDropChargeQuery?.isLoading}
          onClick={() => {
            onSubmitDropCharge();
            // setLoading(true);
          }}
          fullWidth
        >
          ADD
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

export default AddLyxaCharge;
