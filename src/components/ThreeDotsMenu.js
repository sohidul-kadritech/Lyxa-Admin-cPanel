// import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, Menu, MenuItem, styled } from '@mui/material';
import React from 'react';

const DropDown = styled(Menu)(() => ({
  '& .MuiPopover-paper': {
    boxShadow: 'none!important',
    border: '1px solid #EEEEEE',
    borderRadius: '10px',
    padding: '8px 0px',
  },
  '& .MuiMenu-list': {
    padding: '0px',
  },
  '& .MuiMenuItem-root': {
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '24px',
    padding: '3px 20px',
  },
}));

const StyledButton = styled(Button)(() => ({
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0',
  minWidth: '0',
  width: '41px',
  height: '35px',

  '&:hover': {
    background: '#F6F8FA',
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
      <StyledButton
        color="secondary"
        disableRipple
        onClick={handleClick}
        sx={{
          background: anchorEl ? '#F6F8FA' : 'transparent',
        }}
      >
        <MoreHorizIcon />
      </StyledButton>
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
