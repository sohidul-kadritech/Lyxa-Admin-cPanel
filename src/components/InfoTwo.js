import { Tooltip } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const InfoTwo = ({ name, value, Icon, link, mapLink, classes }) => {
  const history = useHistory();
  let check = Array.isArray(value);

  if (!check) {
    return (
      <InfoWrapper
        className={`${link && "cursor-pointer"}}`}
        onClick={() => history.push(link)}
        link={link}
        mapLink={mapLink}
      >
        <Icon className="text-danger" />
        <Tooltip title={`${link ? "See details" : mapLink ? "See Location" : ""}`}>
          {mapLink ? (
            <a className={`item-wrap`} href={mapLink} target="blank">
              <span className="name">{name}:</span>
              <span className={`value ${classes}`}>{value}:</span>
            </a>
          ) : (
            <span className={`item-wrap`}>
              <span className="name">{name}:</span>
              <span className={`value ${classes}`}>{value}</span>
            </span>
          )}
        </Tooltip>
      </InfoWrapper>
    );
  } else {
    return (
      <InfoWrapper
        className={`${link && "cursor-pointer"}  }`}
        onClick={() => history.push(link)}
        link={link}
        mapLink={mapLink}
      >
        <Icon className="text-danger" />
        {value?.map((item, index) => {
          return (
            <span className={`value ${classes || ""}`}>
              {index !== 0 && `, `} {item?.name}
            </span>
          );
        })}
      </InfoWrapper>
    );
  }
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
      font-weight: ${({ link, mapLink }) => (link || mapLink) && "500 !important"};
      text-decoration: ${({ mapLink }) => mapLink && "underline !important"};
    }
  }
  .img {
    font-size: 20px;
    color: #e95b5b;
    margin-right: 10px;
  }
  .item-wrap {
    display: inline-flex;
    align-items: baseline;
    justify-items: flex-start;
    gap: 3px;
    font-size: 14px;
    padding-left: 4px;

    .name {
      text-transform: capitalize;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.75);
      font-size: 16px;
      font-weight: bold,
    }

    .value {
      font-size: 14px;
      text-transform: capitalize;
      font-weight: 500;
      color: #6b6b6b;
    }
  }
`;
