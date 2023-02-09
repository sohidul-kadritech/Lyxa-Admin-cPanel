import { Tooltip } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Td, Tr } from 'react-super-responsive-table';

const valueStyle = {
  fontSize: '14px',
  textTransform: 'capitalize',
  fontWeight: '500',
  color: '#6b6b6b',
  verticalAlign: 'middle',
};

const nameStyle = {
  verticalAlign: 'middle',
  fontSize: '16px',
  textTransform: 'capitalize',
  color: 'rgba(0, 0, 0, 0.75)',
  fontWeight: '500',
};

function InfoTwo({ name, value, Icon, link, mapLink, classes }) {
  const history = useHistory();
  const check = Array.isArray(value);

  if (!check) {
    return (
      <Tr
        onClick={() => {
          // eslint-disable-next-line no-unused-expressions
          link && history.push(link);
        }}
      >
        <Td style={{ width: '35px', paddingBottom: '5px' }}>
          <span style={{ verticalAlign: 'middle' }}>
            <Icon className="text-danger" />
          </span>
        </Td>
        <Td style={{ width: '1px', whiteSpace: 'nowrap', textAlign: 'left', paddingBottom: '5px' }}>
          <span style={nameStyle}>{name}:</span>
        </Td>
        <Td style={{ textAlign: 'left', paddingLeft: '8px', paddingBottom: '5px' }}>
          <Tooltip title={`${link ? 'See details' : mapLink ? 'See Location' : ''}`}>
            {mapLink ? (
              <a href={mapLink} target="blank">
                <span className={`underline ${classes}`} style={valueStyle}>
                  {value}
                </span>
              </a>
            ) : (
              <span className={`${classes} ${link && 'underline'}`} style={valueStyle}>
                {value}
              </span>
            )}
          </Tooltip>
        </Td>
      </Tr>
    );
  }
  return (
    <Tr
      onClick={() => {
        // eslint-disable-next-line no-unused-expressions
        link && history.push(link);
      }}
    >
      <Td style={{ width: '35px', paddingBottom: '5px' }}>
        <span style={{ verticalAlign: 'middle' }}>
          <Icon className="text-danger" />
        </span>
      </Td>
      <Td style={{ width: '1px', 'white-space': 'nowrap', textAlign: 'left', paddingBottom: '5px' }}>
        <span style={nameStyle}>{name}:</span>
      </Td>
      <Td style={{ textAlign: 'left', paddingLeft: '8px', paddingBottom: '5px' }}>
        <span className={`${classes}`}>
          {value?.map((item, index) => (
            <span className={`value ${classes || ''}`}>
              {index !== 0 && `, `} {item?.name}
            </span>
          ))}
        </span>
      </Td>
    </Tr>
  );
}

export default InfoTwo;
