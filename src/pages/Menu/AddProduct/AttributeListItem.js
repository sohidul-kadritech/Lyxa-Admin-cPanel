import { Stack } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import StyledInput from '../../../components/Styled/StyledInput';

export default function AttributeItem({ attributeItem, onDelete, readOnly }) {
  const [render, setRender] = useState(false);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4}>
      <StyledInput
        type="text"
        value={attributeItem?.name}
        readOnly={readOnly}
        placeholder="Type here"
        onChange={(e) => {
          attributeItem.name = e.target.value;
          setRender(!render);
        }}
      />
      <StyledInput
        type="number"
        value={attributeItem?.extraPrice}
        readOnly={readOnly}
        onChange={(e) => {
          attributeItem.extraPrice = e.target.value;
          setRender(!render);
        }}
        placeholder="$"
        sx={{
          width: '115px',
          flexShirk: 0,
          texAlign: 'center',
        }}
      />
      <CloseButton
        color="primary"
        sx={{
          padding: 0,
        }}
        onClick={onDelete}
      />
    </Stack>
  );
}
