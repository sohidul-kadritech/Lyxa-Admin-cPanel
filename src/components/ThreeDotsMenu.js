/* eslint-disable no-unused-vars */
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Menu, MenuItem, styled } from '@mui/material';
import React from 'react';

const DropDown = styled(Menu)(({ theme }) => ({
  '& .MuiPopover-paper': {
    padding: '0px',
    boxShadow: theme.shadows[3],
    minWidth: '100px',
    borderRadius: '8px',
  },
  '& .MuiMenu-list': {
    padding: '0px',
  },
  '& .MuiMenuItem-root': {
    fontSize: '15px',
  },
}));

function ThreeDotsMenu({ menuItems = [], handleMenuClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick}>
        <MoreVertIcon />
      </Button>
      <DropDown anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {menuItems?.map(
          (menu) =>
            menu && (
              <MenuItem
                key={menu}
                value={menu}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('dslfaksdj;');
                  handleMenuClick(menu);
                  handleClose();
                }}
              >
                <span>{menu}</span>
              </MenuItem>
            )
        )}
      </DropDown>
    </>
  );
}

export default ThreeDotsMenu;
