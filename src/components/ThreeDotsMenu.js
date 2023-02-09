import { Button, Menu, MenuItem } from '@mui/material';
import React from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';

function ThreeDotsMenu({ menuItems = [], handleMenuClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (e) => {
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
      <Menu id="card-actions-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {menuItems?.map(
          (menu) =>
            menu && (
              <MenuItem
                key={Math.random()}
                value={menu}
                onClick={() => {
                  handleMenuClick(menu);
                  handleClose();
                }}
              >
                <span>{menu}</span>
              </MenuItem>
            )
        )}
      </Menu>
    </>
  );
}

export default ThreeDotsMenu;
