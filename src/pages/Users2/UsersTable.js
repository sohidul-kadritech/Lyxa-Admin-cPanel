import { Close, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeShopCredential } from '../../store/AdminControl/Admin/adminAction';
import EditUser from './EditUser';

function UsersTable({ data, loading }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  console.log('data: ', data);
  console.log('loading: ', loading);
  const StyledTableRow = styled(TableRow)(() => ({
    td: {
      paddingLeft: '0px',
      borderBottom: '1px dashed #E4E6EF',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.text.secondary2,
      fontWeight: 600,
      paddingLeft: '0px',
      borderBottom: '1px dashed #E4E6EF',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const cols = [
    {
      label: 'EMAIL',
      align: 'left',
    },
    {
      label: 'STATUS',
      align: 'left',
    },
    {
      label: 'ACTION',
      align: 'right',
    },
  ];
  const removeCredential = (id) => {
    dispatch(removeShopCredential(id));
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ padding: '20px', border: '1px solid #E4E6EF', borderRadius: '7px', marginTop: '35px' }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {cols.map((data, i) => (
                <StyledTableCell align={data.align} key={i}>
                  {data.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell component="td">{row?.email}</StyledTableCell>
                <StyledTableCell align="left">{row?.shopStatus}</StyledTableCell>
                <StyledTableCell align="right">
                  <Stack flexDirection="row" justifyContent="end" gap="10px">
                    <Button
                      onClick={() => setOpen(true)}
                      sx={{
                        minWidth: '32px',
                        padding: '9px',
                        height: '32px',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        background: theme.palette.background.secondary,
                      }}
                    >
                      <Edit sx={{ fontSize: '14px' }} />
                    </Button>
                    <Button
                      onClick={() => removeCredential(row?._id)}
                      sx={{
                        minWidth: '32px',
                        padding: '9px',
                        height: '32px',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        background: theme.palette.background.secondary,
                      }}
                    >
                      <Close sx={{ fontSize: '14px' }} />
                    </Button>
                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Drawer open={open} anchor="right">
        <EditUser onClose={() => setOpen(false)} />
      </Drawer>
    </Box>
  );
}

export default UsersTable;
