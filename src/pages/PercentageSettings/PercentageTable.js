import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import StyledTable from '../../components/Styled/StyledTable3';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';

function PercentageTable({ data = [], setSelectedRange, setIsConfirm, loading }) {
  const theme = useTheme();
  console.log(data);
  const [searchResult, setSearchResult] = useState([...data]);

  useEffect(() => {
    setSearchResult(data);
  }, [data]);

  const searchResultHandler = (e) => {
    if (e.target.value) {
      console.log(e.target.value);
      const matchData = data.filter((obj) => obj.name.toString().toLowerCase().includes(e.target.value.toLowerCase()));
      console.log('matchData', matchData);
      setSearchResult(() => [...matchData]);
    } else {
      setSearchResult(() => [...data]);
    }
  };

  const columns = [
    {
      id: 1,
      headerName: 'SELLER',
      field: 'name',
      flex: 1,
      //   minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            color: theme.palette.primary?.main,
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
          variant="body4"
          className="text-capitalize"
        >
          {row?.company_name}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'CHARGE (Percentage)',
      field: 'charge',
      flex: 1,
      //   minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.dropPercentage}%
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: 'ACTION',
      headerAlign: 'right',
      align: 'right',
      field: 'action',
      flex: 1,
      //   minWidth: 200,
      sortable: false,
      // eslint-disable-next-line no-unused-vars
      renderCell: (params) => (
        <StyledIconButton
          color="primary"
          // disabled={params?.row?.isNotEditable}
          sx={{
            '&.Mui-disabled': {
              color: '#c1c1c1',
              backgroundColor: '#F3F6F9',
            },
          }}
          onClick={() => {
            setSelectedRange(params?.row);
            setIsConfirm(true);
          }}
        >
          <DeleteIcon />
        </StyledIconButton>
      ),
    },
  ];
  return (
    <>
      <Stack flexDirection="row" justifyContent="flex-end" gap="17px" marginBottom="30px">
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={searchResultHandler} />
      </Stack>

      {loading ? (
        <TablePageSkeleton row={5} column={4} />
      ) : (
        <Box
          sx={{
            pr: 5,
            pl: 3.5,
            pt: 1,
            pb: 1,
            border: '1px solid #EEEEEE',
            borderRadius: '7px',
            background: '#fff',
          }}
        >
          <StyledTable
            columns={columns}
            rows={searchResult}
            getRowId={(row) => row?._id}
            rowHeight={71}
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  No Order found
                </Stack>
              ),
            }}
          />
        </Box>
      )}
    </>
  );
}

export default PercentageTable;
