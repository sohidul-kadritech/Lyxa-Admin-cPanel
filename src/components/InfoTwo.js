import React from "react";
import { useHistory } from "react-router-dom";
import { Tr, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";

const valueStyle = {
  fontSize: "14px",
  textTransform: "capitalize",
  fontWeight: "500",
  color: "#6b6b6b",
  verticalAlign: "middle",
};

const nameStyle = {
  verticalAlign: "middle",
  fontSize: "16px",
  textTransform: "capitalize",
  color: "rgba(0, 0, 0, 0.75)",
  fontWeight: "500",
};

const InfoTwo = ({ name, value, Icon, link, mapLink, classes }) => {
  const history = useHistory();
  let check = Array.isArray(value);

  if (!check) {
    return (
      <Tr
        onClick={() => {
          link && history.push(link);
        }}
      >
        <Td style={{ width: "35px", paddingBottom: "5px" }}>
          <span style={{ verticalAlign: "middle" }}>
            <Icon className="text-danger" />
          </span>
        </Td>
        <Td style={{ width: "1px", "white-space": "nowrap", textAlign: "left", paddingBottom: "5px" }}>
          <span style={nameStyle}>{name}:</span>
        </Td>
        <Td style={{ textAlign: "left", paddingLeft: "8px", paddingBottom: "5px" }}>
          <Tooltip title={`${link ? "See details" : mapLink ? "See Location" : ""}`}>
            {mapLink ? (
              <a href={mapLink} target="blank">
                <span className={`underline ${classes}`} style={valueStyle}>
                  {value}
                </span>
              </a>
            ) : (
              <span className={`${classes} ${link && "underline"}`} style={valueStyle}>
                {value}
              </span>
            )}
          </Tooltip>
        </Td>
      </Tr>
    );
  } else {
    return (
      <Tr
        onClick={() => {
          link && history.push(link);
        }}
      >
        <Td style={{ width: "35px", paddingBottom: "5px" }}>
          <span style={{ verticalAlign: "middle" }}>
            <Icon className="text-danger" />
          </span>
        </Td>
        <Td style={{ width: "1px", "white-space": "nowrap", textAlign: "left", paddingBottom: "5px" }}>
          <span style={nameStyle}>{name}:</span>
        </Td>
        <Td style={{ textAlign: "left", paddingLeft: "8px", paddingBottom: "5px" }}>
          <span className={`${classes}`}>
            {value?.map((item, index) => {
              return (
                <span className={`value ${classes || ""}`}>
                  {index !== 0 && `, `} {item?.name}
                </span>
              );
            })}
          </span>
        </Td>
      </Tr>
    );
  }
};

export default InfoTwo;
