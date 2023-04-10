import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import PageTop from '../../components/Common/PageTop';
import Wrapper from '../../components/Wrapper';
import AddProduct from './AddProduct';
import CategoryAccordion from './CategoryAccordion';
import OptionsBar from './OptionsBar';
import { categories } from './mock';

export default function MenuPage() {
  // sidebar
  const [sidebarOpen, setSidebarOpen] = useState(null);

  // handle menu
  const onMenuClick = (value) => {
    if (value === 'add-item') {
      setSidebarOpen('add-item');
    }
  };

  return (
    <Wrapper
      sx={{
        paddingTop: 0,
        height: 'auto',
      }}
    >
      <Box className="page-content2">
        <PageTop title="Menu" />
        <OptionsBar searchPlaceHolder="Search 24 items" onMenuClick={onMenuClick} onCollapse={() => {}} />
        {/* main */}
        <Container>
          {categories.map((category) => (
            <Draggable key={category?._id}>
              <CategoryAccordion category={category} />
            </Draggable>
          ))}
        </Container>
      </Box>
      {/* sidebar */}
      <Drawer open={Boolean(sidebarOpen)} anchor="right">
        <AddProduct
          onClose={() => {
            setSidebarOpen(null);
          }}
        />
      </Drawer>
    </Wrapper>
  );
}
