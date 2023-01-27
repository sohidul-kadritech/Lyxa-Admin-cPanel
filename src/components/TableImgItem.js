import { width } from "@mui/system";
import React from "react";

import styled from "styled-components";

const activeIndicator = {
  width: '100%',
  height: '25%',
  position: 'absolute',
  bottom: '0px',
  left: '0px',
  borderRadius: '0px 0px 5px 5px',
  background: '#e1f4d0',
  color: '#56ca00',
  fontSize: '9px',
  display: 'block'
}

const inActiveIndicator = {
  width: '100%',
  height: '25%',
  position: 'absolute',
  bottom: '0px',
  left: '0px',
  borderRadius: '0px 0px 5px 5px',
  background: '#ffcfce',
  color: '#ff0000',
  fontSize: '9px',
  display: 'block'
}

const baseIndicator = {
  display: 'none'
}

const TableImgItem = ({
  img = "",
  name,
  subTitle,
  id = "",
  fromChat = false,
  status,
}) => {
  return (
    <React.Fragment>
      <div className="d-flex align-items-center">
        {img ? (
          <div
            style={{
              width: "60px",
              height: "60px",
              position: 'relative',
            }}
          >
            <img
              className="w-100 h-100"
              loading="lazy"
              style={{ borderRadius: "6px", objectFit: "cover" }}
              src={img}
              alt=""
            />
            <div style={status === 'active' ? activeIndicator : status === 'inactive' ? inActiveIndicator : baseIndicator }>
              {status === 'active' ? 'Online' : 'Offline' }
            </div>
          </div>
        ) : null}
        <div style={{ flex: "1", textAlign: "left" }} className="ps-2">
          <p className="mb-0 text-black">{name}</p>
          <p className="text-muted mb-0" style={{ fontSize: 12 }}>
            {subTitle}
          </p>
          {id && (
            <p className="text-muted mb-0" style={{ fontSize: 12 }}>{`${
              fromChat ? "" : ""
            } ${id}`}</p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

const Wrapper = styled.div``;

export default TableImgItem;
