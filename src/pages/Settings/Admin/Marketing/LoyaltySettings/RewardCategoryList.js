/* eslint-disable no-unsafe-optional-chaining */
import { Add } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import CategoryItem from './RewardCategoryItem';

export default function CategoryList({ rewardCategories, onDrop, onDelete, onSave, onViewShops }) {
  const [showAddItem, setShowAddItem] = useState(false);

  return (
    <Box>
      {/* item */}
      <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
        {rewardCategories.map((item) => (
          <Draggable key={item.name}>
            <CategoryItem category={item} onDelete={onDelete} onSave={onSave} onViewShops={onViewShops} />
          </Draggable>
        ))}
      </Container>
      {showAddItem && (
        <CategoryItem
          category={{ name: '', _id: uniqueId('xxx-'), status: 'active' }}
          onSave={(...props) => {
            onSave(...props, setShowAddItem);
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
