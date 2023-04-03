import { Box, Stack, styled } from '@mui/material';
import { useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

const CustomTable = styled(Box)(() => ({
  borderRadius: '7px',
  background: '#fff',

  '& .custom-t-head': {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  '& .custom-t-head-cell': {
    flex: 1,
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '17px',
    letterSpacing: '0.03em',
    color: '#737373',
  },

  '& .row': {
    display: 'flex!important',
    flexDirection: 'row',

    '& > *': {
      flex: 1,
      paddingLeft: '24px',
      paddingRight: '24px',
      paddingTop: '16px',
      paddingBottom: '16px',
      borderBottom: '1px dashed #E4E6EF',
    },
  },

  '& .custom-t-cell': {
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px dashed #E4E6EF',
  },
}));

export default function StyledTable4({ columns, rows, getRowKey }) {
  const [render, setRender] = useState(false);

  const dropSort = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;

    const item = rows.splice(removedIndex, 1);
    rows.splice(addedIndex, 0, item[0]);

    setRender(!render);
  };

  return (
    <CustomTable>
      <Stack className="head row">
        {columns.map((column) => (
          <Stack
            key={column.id}
            direction="row"
            className="custom-t-head-cell custom-t-cell"
            sx={{
              flex: `${column.flex}!important`,
              alignItems: 'center',
              justifyContent: `${column.align}!important`,
            }}
          >
            {column?.headerName}
          </Stack>
        ))}
      </Stack>
      <Container
        onDrop={dropSort}
        lockAxis="y"
        dragHandleSelector=".drag-handler"
        render={(ref) => (
          <Box className="custom-t-body" ref={ref}>
            {rows.map((row) => (
              <Draggable
                key={getRowKey(row)}
                render={() => (
                  <Box>
                    <Stack className="row">
                      {columns.map((column, index) => (
                        <Stack
                          direction="row"
                          key={index}
                          sx={{
                            flex: `${column.flex}!important`,
                            alignItems: 'center',
                            justifyContent: `${column.align}!important`,
                          }}
                        >
                          {column.renderCell({ row, column })}
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                )}
              />
            ))}
          </Box>
        )}
      />
    </CustomTable>
  );
}
