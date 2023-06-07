import { Box, Button, Stack, Typography } from '@mui/material';
import { React, useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';

const getDataInit = (shopId) => ({ shopId, amount: 0, type: 'remove', desc: '' });

const typeOptions = [
  { label: 'Remove', value: 'remove' },
  { label: 'Add', value: 'add' },
];

export default function AddRemoveCredit({ shopId, onSubmit, onClose }) {
  const [data, setData] = useState(getDataInit(shopId));

  return (
    <Box
      sx={{
        background: '#fff',
        padding: '15px 20px 20px 20px',
        borderRadius: '7px',
        minWidth: '700px',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
        <Typography fontSize="18px" variant="h4">
          Add / Remove Credit
        </Typography>
        <CloseButton onClick={onClose} size="sm" />
      </Stack>
      <Box>
        <Box pb={3}>
          <StyledRadioGroup
            sx={{
              flexDirection: 'row',
              gap: '25px',
            }}
            items={typeOptions}
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
          />
        </Box>
        <StyledFormField
          label="Amount *"
          intputType="text"
          inputProps={{
            type: 'number',
            value: data.amount,
            onChange: (e) => {
              if (e.target.value > 0) setData({ ...data, amount: e.target.value });
            },
          }}
        />
        <StyledFormField
          label="Description"
          intputType="textarea"
          inputProps={{
            multiline: true,
            value: data.desc,
            onChange: (e) => setData({ ...data, desc: e.target.value }),
          }}
        />
        <Stack direction="row" alignItems="center" justifyContent="flex-end" pt={6.5}>
          <Button
            color="primary"
            variant="contained"
            sx={{ width: '200px' }}
            onClick={() => {
              onSubmit(data);
            }}
            disabled={onSubmit}
          >
            Pay
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
