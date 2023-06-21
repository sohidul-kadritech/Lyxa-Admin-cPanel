import React from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';

function ViewCategory({ onClose, selectedCategory }) {
  console.log('selectedCategory: ', selectedCategory);
  return <SidebarContainer title="View Category" onClose={onClose}></SidebarContainer>;
}

export default ViewCategory;
