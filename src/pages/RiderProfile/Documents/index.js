/* eslint-disable no-unused-vars */
// project import
import { Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Modal, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import ConfirmModal from '../../../components/Common/ConfirmModal';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledTable from '../../../components/Styled/StyledTable3';
import { downloadFile } from '../../../helpers/downloadFile';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import EditDocument from './EditDocument';

const createDocumentRows = (rider) => {
  const rows = [];

  const typeLabelMap = {
    contractImage: 'Contract Paper',
    image: 'Profile',
    nationalIdDocument: 'National ID',
    vehicleRegistrationDocument: 'Vehicle Document',
  };

  Object.entries(rider).forEach((pair) => {
    if (typeof pair[1] === 'string' && pair[1]?.includes('https://storage.googleapis.com')) {
      rows?.push({ _id: pair[0], type: typeLabelMap[pair[0]], propertyName: pair[0], url: pair[1] });
    }
  });

  return rows;
};

export default function Documents({ rider }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editDocumentOpen, setEditDocumentOpen] = useState(false);
  const [currentDocumet, setCurrentDocumet] = useState({});
  const rows = useMemo(() => createDocumentRows(rider), [rider]);

  const updateRiderMutation = useMutation((data) => AXIOS.post(Api.EDIT_DELIVERY_MAN, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        rider.contractImage = data?.data?.delivery?.contractImage;
        rider.image = data?.data?.delivery?.image;
        rider.nationalIdDocument = data?.data?.delivery?.nationalIdDocument;
        rider.vehicleRegistrationDocument = data?.data?.delivery?.vehicleRegistrationDocument;
        setEditDocumentOpen(false);
      }
    },
  });

  const replaceDocument = (document) => {
    updateRiderMutation.mutate({ id: rider?._id, [document?.propertyName]: document?.url });
  };

  const removeDocument = () => {
    updateRiderMutation.mutate({ id: rider?._id, [currentDocumet?.propertyName]: '' });
  };

  const columns = [
    {
      id: 1,
      headerName: 'TYPE',
      field: 'type',
      flex: 2,
      sortable: false,
      minWidth: 270,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 3,
      headerName: `DATE`,
      sortable: false,
      field: 'createdAt',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          <StyledIconButton
            color="primary"
            onClick={() => {
              downloadFile(row?.url);
            }}
          >
            <DownloadIcon />
          </StyledIconButton>
          <StyledIconButton
            onClick={() => {
              setCurrentDocumet(row);
              setEditDocumentOpen(true);
            }}
            color="primary"
          >
            <Edit />
          </StyledIconButton>
          <StyledIconButton
            color="primary"
            onClick={() => {
              setConfirmOpen(true);
              setCurrentDocumet(row);
            }}
          >
            <CloseIcon />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  return (
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
        rows={rows}
        getRowId={(row) => row?._id}
        rowHeight={71}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Documents found
            </Stack>
          ),
        }}
      />
      <ConfirmModal
        message="Are you sure you want to delete this resource?"
        isOpen={confirmOpen}
        loading={updateRiderMutation?.isLoading}
        onCancel={() => {
          setConfirmOpen(false);
          setCurrentDocumet({});
        }}
        onConfirm={() => {
          setConfirmOpen(false);
          removeDocument(currentDocumet);
        }}
      />
      <Modal open={editDocumentOpen} onClose={() => setEditDocumentOpen(false)}>
        <Box
          sx={{
            height: '100vh',
            width: '100%',
            WebkitFlex: '1',
            MsFlex: '1',
            flex: '1',
            display: 'flex',
            overflowY: 'scroll',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '30px',
            paddingBottom: '30px',
          }}
        >
          <EditDocument
            loading={updateRiderMutation.isLoading}
            document={currentDocumet}
            onClose={() => {
              setEditDocumentOpen(false);
              setCurrentDocumet({});
            }}
            onReplaceDoc={replaceDocument}
          />
        </Box>
      </Modal>
    </Box>
  );
}
