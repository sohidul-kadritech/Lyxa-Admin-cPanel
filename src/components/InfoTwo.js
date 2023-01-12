import { Tooltip } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const InfoTwo = ({ value, Icon, link, mapLink, classes }) => {
  const history = useHistory();

  return (
    <InfoWrapper
      className={`${link && "cursor-pointer"}  }`}
      onClick={() => history.push(link)}
      link={link}
      mapLink={mapLink}
    >
      <Icon className="text-danger" />
      <Tooltip
        title={`${link ? "See details" : mapLink ? "See Location" : ""}`}
      >
        {mapLink ? (
          <a className={`value ${classes || ''}`} href={mapLink} target="blank">
            {value}
          </a>
        ) : (
          <span className={`value ${classes || ''}`}>{value}</span>
        )}
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
      color: ${({ link, mapLink }) => (link || mapLink ? "green" : "black")};
      font-weight: ${({ link, mapLink }) =>
        (link || mapLink) && "500 !important"};
      text-decoration: ${({ mapLink }) => mapLink && "underline !important"};
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
