import { Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { discountTypeOptions } from '../PercentageSettings/helpers';

const intial = {
  chargeType: '',
  charge: '',
};
function AddLyxaCharge({ onClose }) {
  const [currentLyxaCharge, setCurrentLyxaCharge] = useState({ ...intial });

  const changeHandler = (e) => {
    setCurrentLyxaCharge((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
            // value: newSellerData?.company_name,
            placeholder: 'Lyxa Charge Type',
            value: currentLyxaCharge?.chargeType || '',
            name: 'chargeType',
            items: discountTypeOptions,
            onChange: changeHandler,
            //   readOnly: isReadOnly,
          }}
        />
        <StyledFormField
          label="Lyxa charge *"
          intputType="text"
          containerProps={{
            sx: { padding: '14px 0' },
          }}
          inputProps={{
            value: currentLyxaCharge?.charge,
            placeholder: 'Lyxa charge',
            type: 'number',
            name: 'charge',
            onChange: changeHandler,
            //   readOnly: isReadOnly,
          }}
        />
      </Stack>
      <Stack sx={{ padding: '30px 0px' }}>
        <Button
          disableElevation
          variant="contained"
          // disabled={loading}
          // onClick={() => {
          //   onSubmitSeller();
          //   setLoading(true);
          // }}
          fullWidth
        >
          ADD
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

export default AddLyxaCharge;
