/* eslint-disable no-unsafe-optional-chaining */
import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import CategoryItem from './RewardCategoryItem';

export default function CategoryList({ rewardCategories, onDrop, onDelete, onSave, onViewShops, setGlobalChange }) {
  const [showAddItem, setShowAddItem] = useState(false);

  return (
    <Box>
      {/* item */}
      {rewardCategories?.length >= 1 && (
        <Container onDrop={onDrop} lockAxis="y" dragHandleSelector=".drag-handler">
          {rewardCategories.map((item) => (
            <Draggable key={item.name}>
              <CategoryItem
                category={item}
                onDelete={onDelete}
                onSave={onSave}
                onViewShops={onViewShops}
                setGlobalChange={setGlobalChange}
              />
            </Draggable>
          ))}
        </Container>
      )}
      {rewardCategories?.length < 1 && !showAddItem && (
        <Box pt={2} pb={2}>
          <Typography variant="body3">No Categories Added</Typography>
        </Box>
      )}
      {showAddItem && (
        <CategoryItem
          setGlobalChange={setGlobalChange}
          category={{ name: '', _id: uniqueId('xxx-'), status: 'active' }}
          onSave={(...props) => {
            onSave(...props, setShowAddItem);
          }}
          isAddNew
        />
      )}
      <Button
        color="primary"
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
