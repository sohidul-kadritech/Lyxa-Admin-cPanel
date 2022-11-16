import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";

const ThreeDotsMenu = ({ menuItems = [], handleMenuClick }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);



    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <React.Fragment>
            <Button onClick={handleClick}>
                <MoreVertIcon />
            </Button>
            <Menu
                id="card-actions-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {menuItems?.map((menu, index) => (
                    <MenuItem key={index} value={menu} onClick={() => {
                        handleMenuClick(menu);
                        handleClose();
                    }}>
                        <span>{menu}</span>
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    )
}

export default ThreeDotsMenu;
