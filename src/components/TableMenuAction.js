import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { Container } from "reactstrap";
import styled from "styled-components";
import GlobalWrapper from './../components/GlobalWrapper';

const TableMenuAction = ({ actionMenu, open, handleClose }) => {

    return (
        <React.Fragment>
            <Menu
                id="basic-menu"
                anchorEl={actionMenu}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        </React.Fragment>
    );
};


const Wrapper = styled.div`


.heading{
  color: red;
}


`

export default TableMenuAction;
