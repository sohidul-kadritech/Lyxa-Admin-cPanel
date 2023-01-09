import React from "react";

import styled from "styled-components";

const TableImgItem = ({
  img = "",
  name,
  subTitle,
  id = "",
  fromChat = false,
}) => {
  return (
    <React.Fragment>
      <div className="d-flex align-items-center">
        {img ? (
          <div style={{ width: "60px", height: "60px" }}>
            <img
              className="w-100 h-100"
              loading="lazy"
              style={{ borderRadius: "6px" }}
              src={img}
              alt=""
            />
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
