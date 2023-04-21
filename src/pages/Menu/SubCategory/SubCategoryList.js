import { Add } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import StyledInput from '../../../components/Styled/StyledInput';
import { getSubCategoryInit } from './helpers';

export default function SubCategoryList({ subCategories, onDelete }) {
  const [render, setRender] = useState(false);

  return (
    <Box>
      <Stack gap={4} mb={4}>
        {subCategories.map((category) => (
          <Stack key={category?.id} direction="row" alignItems="center" justifyContent="space-between" gap={4}>
            <StyledInput
              type="text"
              value={category?.name}
              fullWidth
              placeholder="Type here"
              onChange={(e) => {
                category.name = e.target.value;
                setRender(!render);
              }}
            />
            <CloseButton
              color="primary"
              sx={{
                padding: 0,
              }}
              onClick={() => {
                onDelete(category);
              }}
            />
          </Stack>
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
          subCategories.push(getSubCategoryInit());
          setRender(!render);
        }}
      >
        Add
      </Button>
    </Box>
  );
}
