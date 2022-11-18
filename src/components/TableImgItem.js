import React from "react";
import { Container } from "reactstrap";
import styled from "styled-components";

const TableImgItem = ({ img = "", name, id = "" }) => {
  return (
    <React.Fragment>
      <div className="d-flex align-items-center">
        {img && (
          <div style={{ width: "50px", height: "50px" }}>
            <img
              className="w-100 h-100"
              lazy="loading"
              style={{ borderRadius: "6px" }}
              src={img}
              alt=""
            />
          </div>
        )}
        <div style={{ flex: "1", textAlign: "left" }} className="ps-2">
          <p className="mb-0 text-black">{name}</p>
          {id && <p className="text-muted mb-0">{`ID: ${id}`}</p>}
        </div>
      </div>
    </React.Fragment>
  );
};

const Wrapper = styled.div``;

export default TableImgItem;
