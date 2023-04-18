import { Add } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../components/Common/CloseButton';
import StyledInput from '../../components/Styled/StyledInput';

const categoryInt = {
  name: '',
};

// eslint-disable-next-line no-unused-vars
export default function SubCategoryList({ subCategories, onDelete }) {
  const [render, setRender] = useState(false);

  return (
    <Box>
      <Stack gap={4} mb={4}>
        {subCategories.map((category, index) => (
          <Stack key={index} direction="row" alignItems="center" justifyContent="space-between" gap={4}>
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
                subCategories.splice(index, 1);
                setRender(!render);
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
          subCategories.push({ ...categoryInt });
          setRender(!render);
        }}
      >
        Add
      </Button>
    </Box>
  );
}
