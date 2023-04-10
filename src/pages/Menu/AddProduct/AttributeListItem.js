import { Stack } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import StyledInput from '../../../components/Styled/StyledInput';

export function AttributeItem({ attributeItem, onDelete }) {
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4}>
      <StyledInput
        type="text"
        value={attributeItem?.name}
        placeholder="Type here"
        onChange={(e) => {
          attributeItem.name = e.target.value;
          setRender((prev) => !prev);
        }}
      />
      <StyledInput
        type="number"
        value={attributeItem?.price}
        onChange={(e) => {
          attributeItem.price = e.target.value;
          setRender((prev) => !prev);
        }}
        placeholder="$"
        sx={{
          width: '78px',
          flexShirk: 0,
          texAlign: 'center',
        }}
      />
      <CloseButton
        color="primary"
        sx={{
          padding: 0,
        }}
        onClick={() => {
          onDelete(attributeItem);
        }}
      />
    </Stack>
  );
}
