// thrid pary
import { Edit, Visibility } from '@mui/icons-material';
import { Chip, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import StyledTable4 from '../../../components/Styled/StyledTable4';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const statusColorVariants = {
  inactive: {
    background: '#FEE2E2',
    color: '#DD5B63',
  },
  active: {
    background: '#e1f4d0',
    color: '#56ca00',
  },
};

export default function ListTable({ items, onEdit }) {
  const theme = useTheme();
  const [render, setRender] = useState(false);

  const tagsMutation = useMutation((data) =>
    AXIOS.post(Api.UPDATE_TAGS_AND_CUSINES, {
      ...data,
    })
  );

  const dropSort = ({ removedIndex, addedIndex }) => {
    console.log(removedIndex, addedIndex);
    if (removedIndex === null || addedIndex === null) return;

    const item = items.splice(removedIndex, 1);
    items.splice(addedIndex, 0, item[0]);
    tagsMutation.mutate({ ...item[0], sortingOrder: addedIndex });
    setRender(!render);
  };

  const allColumns = [
    {
      id: 1,
      headerName: `NAME`,
      sortable: false,
      field: 'product',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={4}>
          <HandleIcon className="drag-handler" />
          <Typography
            variant="body4"
            sx={{
              color: theme.palette.text.primary,
              paddingLeft: '5px',
            }}
          >
            {params.row.name}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `STATUS`,
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Chip
          className="text-capitalize"
          label={params?.row?.status || ''}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusColorVariants[params?.row?.status] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      id: 3,
      headerName: `TYPE`,
      sortable: false,
      field: 'type',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Typography
          variant="body4"
          className="text-capitalize"
          sx={{
            color: theme.palette.text.primary,
            paddingLeft: '5px',
          }}
        >
          {params.row.type}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: `ACTION`,
      sortable: false,
      field: 'action',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          <StyledSwitch />
          <StyledIconButton
            color="secondary"
            sx={{
              marginLeft: '17px',
            }}
          >
            <Visibility />
          </StyledIconButton>
          <StyledIconButton
            onClick={() => {
              onEdit(params.row);
            }}
            color="secondary"
          >
            <Edit />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  return <StyledTable4 columns={allColumns} rows={items} getRowKey={(row) => row?._id} onDrop={dropSort} />;
}
