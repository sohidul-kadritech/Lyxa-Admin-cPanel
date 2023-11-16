/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import { useGlobalContext } from '../../../context';
import AttributeItem from './AttributeListItem';

const attributeInit = {
  name: '',
  extraPrice: '0',
};

function AttributeList({ items, readOnly, setMaxLimit }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const [showAddNew, setShowAddNew] = useState(true);
  const [render, setRender] = useState(false);
  const [newAttributeItem, setNewAttributeItem] = useState(attributeInit);

  const onDelete = (item, index) => {
    items.splice(index, 1);
    setMaxLimit(items?.length);
    setRender(!render);
  };

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
          Price ({currency})
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
          <AttributeItem
            attributeItem={attributeItem}
            key={index}
            readOnly={readOnly}
            onDelete={() => {
              if (readOnly) {
                return;
              }
              onDelete(attributeItem, index);
            }}
          />
        ))}
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
          if (readOnly) {
            return;
          }
          setShowAddNew(true);
          items.push({ ...attributeInit });
          console.log(items?.length);
          setMaxLimit(items?.length);
          setRender(!render);
        }}
      >
        Add
      </Button>
    </Box>
  );
}

export default AttributeList;
