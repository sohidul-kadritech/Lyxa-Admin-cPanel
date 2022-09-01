import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Tooltip } from "@mui/material";

const Info = ({ title, value = "", link, flagOrderRoute }) => {
  const history = useHistory();

  return (
    <Details link={link} flagOrder={flagOrderRoute}>
      <div className="title">
        <Tooltip title={`${flagOrderRoute ? "Go to Order" : ""}`}>
          <span
            className={`${flagOrderRoute && "cursor-pointer"}  }`}
            onClick={() => history.push(flagOrderRoute)}
          >
            {title}
          </span>
        </Tooltip>
      </div>
      <div className="value">
        <Tooltip title={`${link ? "See details" : ""}`}>
          <span
            className={`${link && "cursor-pointer"}  }`}
            onClick={() => history.push(link)}
          >
            {value}
          </span>
        </Tooltip>
      </div>
    </Details>
  );
};

const Details = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  border-bottom: none;
  /* padding: 5px; */
  /* max-height: 50px;
  overflow: hidden scroll; */
  /* height: 50px; */
  &:last-child {
    border-bottom: 1px solid lightgray;
  }
  .title {
    width: 170px;
    /* border-right: 1px solid lightgray; */
    /* padding: 10px; */
    color: black;
    font-weight: 500;
    padding-left: 5px;
    /* @media (max-width: 1200px) {
      width: 170px;
    } */
    span {
      &:hover {
        color: ${({ flagOrder }) => flagOrder && "blue"};
        font-weight: ${({ flagOrder }) => flagOrder && "bold"};
      }
      text-decoration: ${({ flagOrder }) => flagOrder && "underline"};
    }
  }

  .value {
    flex: 1;
    color: green;
    font-weight: 500;
    font-size: 15px;
    padding-left: 5px;
    text-transform: capitalize;
    border-left: 1px solid lightgray;
    padding: 4px;
    /* overflow: hidden scroll;
    height: 100%; */
    display: flex;
    align-items: center;
    &:hover {
      color: ${({ link }) => link && "blue"};
      font-weight: ${({ link }) => link && "bold"};
    }
    text-decoration: ${({ link }) => link && "underline"};
  }
`;

export default Info;
