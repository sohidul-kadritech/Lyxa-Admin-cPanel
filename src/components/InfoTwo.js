import { Tooltip } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const InfoTwo = ({ value, Icon, link }) => {
  const history = useHistory();

  return (
    <InfoWrapper
      className={`${link && "cursor-pointer"}  }`}
      onClick={() => history.push(link)}
      link={link}
    >
      <Icon className="text-danger" />
      <Tooltip title={`${link ? "See details" : ""}`}>
        <span className="value">{value}</span>
      </Tooltip>
    </InfoWrapper>
  );
};

export default InfoTwo;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  &:hover {
    text-decoration: ${({ link }) => link && "underline"};

    .value {
      //   color: ${({ link }) => link && ""};
      font-weight: ${({ link }) => link && "bold"};
    }
  }

  .img {
    font-size: 20px;
    color: #e95b5b;
    margin-right: 10px;
  }
  .value {
    font-size: 14px;
    text-transform: capitalize;
    font-weight: 500;
    color: #6b6b6b;
  }
`;
