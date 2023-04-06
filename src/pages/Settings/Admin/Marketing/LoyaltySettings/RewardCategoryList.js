/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import CategoryItem from './RewardCategoryItem';

const inputSx = {
  '& input': {
    fontSize: '13px',
    textAlign: 'center',
  },
};

export default function CategoryList({ rewardCategory, setRewardCategory, onDrop, onDelete, onAddNew }) {
  const [showAddItem, setShowAddItem] = useState(false);

  return (
    <Box>
      {/* item */}
      <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
        {rewardCategory.map((item, index) => (
          <Draggable key={item.name}>
            <CategoryItem category={item} onDelete={onDelete} onEnter={onAddNew} />
          </Draggable>
        ))}
      </Container>
      {showAddItem && (
        <CategoryItem
          category={{ name: '', _id: uniqueId(), status: 'active' }}
          onEnter={(...props) => {
            onAddNew(...props, setShowAddItem);
          }}
          isAddNew
        />
      )}
      <Button
        color="secondary"
        variant="text"
        disableRipple
        startIcon={<Add />}
        sx={{
          fontSize: '14px',
          lineHeight: '17px',
          mt: 2,
        }}
        onClick={() => {
          setShowAddItem(true);
        }}
      >
        Add category
      </Button>
    </Box>
  );
}
