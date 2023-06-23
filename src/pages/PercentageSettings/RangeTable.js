import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Stack, Typography } from '@mui/material';
// eslint-disable-next-line import/no-named-as-default
// eslint-disable-next-line import/no-named-as-default
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-named-as-default
import { Edit } from '@mui/icons-material';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import StyledTable from '../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../context';
import { AddMenuButton } from '../Faq2';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';

function RangeTable({ data = [], setSelectedRange, setIsConfirm, setOpen, setEditedData, loading, setIsEdit }) {
  console.log('=====>range data', data);

  const [searchResult, setSearchResult] = useState([...data]);

  useEffect(() => {
    setSearchResult(data);
  }, [data]);

  const searchResultHandler = (e) => {
    if (e.target.value) {
      const matchData = data.filter(
        (item) =>
          item?.to.toString() === e.target.value ||
          item?.from.toString() === e.target.value ||
          item?.charge.toString() === e.target.value ||
          // eslint-disable-next-line prettier/prettier
          item?.deliveryPersonCut.toString() === e.target.value,
      );
      console.log(matchData);
      setSearchResult(() => [...matchData]);
    } else {
      setSearchResult(() => [...data]);
    }
  };

  const { general } = useGlobalContext();
  const { currency } = general;
  console.log('currency', currency);
  const columns = [
    {
      id: 1,
      headerName: 'RANGE FROM',
      field: 'from',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.from} KM
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: 'RANGE TO',
      field: 'to',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.to} KM
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'LYXA CHARGE',
      field: 'charge',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {`${currency?.code} ${row?.charge}`}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: 'RIDER CUT',
      field: 'deliveryPersonCut',
      flex: 1,
      minWidth: 200,
      sortable: false,
      // eslint-disable-next-line no-unused-vars
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {`${currency?.code} ${row?.deliveryPersonCut}`}
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
      minWidth: 200,
      sortable: false,
      // eslint-disable-next-line no-unused-vars
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={3}>
          <StyledIconButton
            onClick={() => {
              setOpen(true);
              setEditedData(params?.row);
              setIsEdit(true);
              // setSelectedShop(params?.row);
            }}
            color="primary"
          >
            <Edit />
          </StyledIconButton>
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
              setSelectedRange(params.row);
              setIsConfirm(true);
              setEditedData({});
            }}
          >
            <DeleteIcon />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];
  return (
    <>
      <Stack flexDirection="row" justifyContent="flex-end" gap="17px" marginBottom="30px">
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={searchResultHandler} />
        <AddMenuButton
          onClick={() => {
            setOpen(true);
            setIsEdit(false);
          }}
        />
      </Stack>

      {loading ? (
        <TablePageSkeleton row={5} column={5} />
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
                  No range found
                </Stack>
              ),
            }}
          />
        </Box>
      )}
    </>
  );
}

export default RangeTable;
