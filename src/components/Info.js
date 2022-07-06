import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";

const Info = ({ title, value, link }) => {
  const history = useHistory();

  return (
    <Details link={link}>
      <div className="title">
        <span>{title} </span>
      </div>
      <Tooltip title={`${link ? "See details" : ""}`}>
        <span
          className={`${link && "cursor-pointer"} value }`}
          onClick={() => history.push(link)}
        >
          {value}
        </span>
      </Tooltip>
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
    border-right: 1px solid lightgray;
    padding: 10px;
    color: black;
    font-weight: 500;

    @media (max-width: 1200px) {
      width: 150px;
    }
  }

  .value {
    flex: 1;
    color: green;
    font-weight: 500;
    font-size: 15px;
    padding-left: 5px;
    &:hover {
      color: ${({ link }) => link && "blue"};
      font-weight: ${({ link }) => link && "bold"};
    }
    text-decoration: ${({ link }) => link && "underline"};
  }
`;

export default Info;
