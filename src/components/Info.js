import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Tooltip } from "@mui/material";

const Info = ({ title, value = "", link, flagOrderRoute, valueTwo = "" }) => {
  const history = useHistory();

  return (
    <Details link={link} flagOrder={flagOrderRoute}>
      <div className="title">
        <Tooltip title={`${flagOrderRoute ? "Go to Order" : ""}`}>
          <span
            className={`${flagOrderRoute ? "cursor-pointer" : ""}  }`}
            onClick={() => history.push(flagOrderRoute)}
          >
            {title}
          </span>
        </Tooltip>
      </div>
      <div className="value valueOne">
        <Tooltip title={`${link ? "See details" : ""}`}>
          <span
            className={`${link ? "cursor-pointer" : ""}`}
            onClick={() => history.push(link)}
          >
            {value}
          </span>
        </Tooltip>
      </div>
      {valueTwo && (
        <div className="value valueTwo">
          <span>{valueTwo}</span>
        </div>
      )}
    </Details>
  );
};

const Details = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  border-bottom: none;

  &:last-child {
    border-bottom: 1px solid lightgray;
  }
  .title {
    width: 120px;
    color: black;
    font-weight: 500;
    padding-left: 5px;
    span {
      &:hover {
        color: ${({ flagOrder }) => flagOrder && "blue"};
        font-weight: ${({ flagOrder }) => flagOrder && "bold"};
      }
      text-decoration: ${({ flagOrder }) => flagOrder && "underline"};
    }
  }

  .value {
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

    &.valueOne {
      flex: 1;
      color: #02a499;
      &:hover {
        color: ${({ link }) => link && "blue"};
        font-weight: ${({ link }) => link && "bold"};
        text-decoration: ${({ link }) => link && "underline"};
      }
    }

    &.valueTwo {
      border: none;
    }
  }
`;

export default Info;
