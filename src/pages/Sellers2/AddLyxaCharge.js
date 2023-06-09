import { Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';
import { discountTypeOptions } from '../PercentageSettings/helpers';

const intial = {
  dropPercentageType: '',
  dropPercentage: '',
};
// eslint-disable-next-line no-unused-vars
function AddLyxaCharge({ onClose, sellerDropChargeQuery, currentSeller }) {
  const [currentLyxaCharge, setCurrentLyxaCharge] = useState({ ...intial });

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
            //   readOnly: isReadOnly,
          }}
        />
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
