/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import { AttributeItem } from './AttributeListItem';

const attributeInit = {
  name: '',
  price: '',
};

function AttributeList({ items, onDelete }) {
  const [showAddNew, setShowAddNew] = useState(true);
  const [newAttributeItem, setNewAttributeItem] = useState(attributeInit);

  return (
    <Box pb={4}>
      <Stack direction="row" alignItems="center" gap="16px" pb={2}>
        <Typography
          variant="h5"
          sx={{
            flex: 1,
            fontWeight: '600',
            fontSize: '15px',
            lineHeight: '18px',
          }}
        >
          Attribute
        </Typography>
        <Typography
          variant="h5"
          sx={{
            width: '72px',
            fontWeight: '600',
            fontSize: '15px',
            lineHeight: '18px',
          }}
        >
          Price
        </Typography>
        <Box>
          <CloseButton
            sx={{
              visibility: 'hidden',
              opacity: '0',
              padding: 0,
            }}
          />
        </Box>
      </Stack>
      <Stack gap={4} pb={3}>
        {items.map((attributeItem, index) => (
          <AttributeItem attributeItem={attributeItem} key={index} onDelete={onDelete} />
        ))}
        {showAddNew && <AttributeItem attributeItem={newAttributeItem} onDelete={onDelete} />}
      </Stack>
      <Button
        disableRipple
        color="primary"
        variant="text"
        startIcon={<Add />}
        sx={{
          fontSize: '14px',
          lineHeight: '17px',
        }}
        onClick={() => {
          setShowAddNew(true);
        }}
      >
        Add
      </Button>
    </Box>
  );
}

export default AttributeList;
