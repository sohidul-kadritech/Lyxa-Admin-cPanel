/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Avatar, Box, Modal, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import ConfirmModal from '../../components/Common/ConfirmModal';
import EditDocument from '../../components/Common/EditDocument';
import Rating from '../../components/Common/Rating';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import StyledTable from '../../components/Styled/StyledTable3';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import { useGlobalContext } from '../../context';
// eslint-disable-next-line no-unused-vars
const calculateTotal = (array) => {
  if (array?.length > 0) return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return 0;
};

function ShopList({
  data,
  tabName = 'Shop List',
  setOpen,
  setSelectedShop,
  currentSeller,
  replaceDocument,
  removeDocument,
  editSellerQuery,
  isConfirmModal,
  setIsConfirmModal,
  loading,
  adminType,
  ...props
}) {
  const theme = useTheme();

  const [currentDocumet, setCurrentDocumet] = useState({});

  const history = useHistory();
  const routeMatch = useRouteMatch();
  const paramsQuery = useParams();

  const { dispatchCurrentUser } = useGlobalContext();

  const allColumns = [
    {
      id: 1,
      showFor: ['Shop List'],
      headerName: '',
      field: 'rowNumber',
      flex: 1,
      sortable: false,
      maxWidth: 90,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 1,
      showFor: ['Shop List'],
      headerName: `SHOP NAME`,
      field: 'shopName',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px" padding="16px 0px">
          <Stack flexDirection="row" alignItems="center" gap="20px">
            <Avatar src={params?.row?.shopLogo}></Avatar>
            <Stack>
              <Typography
                variant="h6"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  color: theme.palette.primary?.main,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
                onClick={() => {
                  history.push({
                    pathname: `/shop/profile/${params?.row?._id}`,
                    state: {
                      from: paramsQuery.sellerId ? `/seller/list/${paramsQuery.sellerId}` : routeMatch?.path,
                      backToLabel: 'Back to Seller List',
                    },
                  });
                  dispatchCurrentUser({ type: 'shop', payload: { shop: { ...params?.row, seller: currentSeller } } });
                }}
              >
                {params?.row?.shopName}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      ),
    },
    {
      id: 2,
      showFor: ['Shop List'],
      headerName: 'BRAND',
      field: 'shopBrand',
      flex: 1.5,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value || '_'}</Typography>,
    },
    {
      id: 3,
      showFor: ['Shop List'],
      headerName: `CUSTOMERS`,
      field: 'customers',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="h6"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {params?.row?.totalCustomers}
        </Typography>
      ),
    },

    {
      id: 2,
      showFor: ['Shop List'],
      headerName: `ORDERS`,
      field: 'orders',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="h6"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {params?.row?.totalOrder}
        </Typography>
      ),
    },
    {
      id: 3,
      showFor: ['Shop List'],
      headerName: `RATING`,
      field: 'rating',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Rating
          amount={params?.row?.rating}
          titleSx={{
            fontSize: '15px',
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      id: 3,
      showFor: ['Documents'],
      headerName: `TYPE`,
      field: 'type',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body4"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'default',
            textTransform: 'capitalize',
            padding: '16px 0px',
            color: theme.palette.text?.primary,
          }}
        >
          {params?.row?.title}
        </Typography>
      ),
    },

    {
      id: 3,
      showFor: ['Shop List'],
      headerName: `ACTIONS`,
      headerAlign: 'right',
      align: 'right',
      field: 'action',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {/* edit */}
          {adminType !== 'customerService' && (
            <StyledIconButton
              onClick={() => {
                setOpen(true);
                props.setSelectedMenu('edit_shop');
                setSelectedShop(params?.row);
              }}
              color="primary"
            >
              <Edit />
            </StyledIconButton>
          )}
          <StyledIconButton
            onClick={() => {
              setSelectedShop(params?.row);
              props.setSelectedMenu('');
              setOpen(true);
            }}
            color="primary"
          >
            <VisibilityIcon />
          </StyledIconButton>
          {/* delete */}
        </Stack>
      ),
    },
    {
      id: 3,
      showFor: ['Documents'],
      headerName: `ACTIONS`,
      headerAlign: 'right',
      align: 'right',
      field: 'action',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          <StyledIconButton color="primary">
            <DownloadIcon />
          </StyledIconButton>
          {adminType !== 'customerService' && (
            <StyledIconButton
              onClick={() => {
                setCurrentDocumet(row);
                props?.setEditDocumentOpen(true);
              }}
              color="primary"
            >
              <Edit />
            </StyledIconButton>
          )}
          {adminType !== 'customerService' && (
            <StyledIconButton
              color="primary"
              onClick={() => {
                setIsConfirmModal(true);
                setCurrentDocumet(row);
              }}
            >
              <CloseIcon />
            </StyledIconButton>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box
      sx={{
        padding: '7.5px 16px  2px',
        maxHeight: '350px',
        overflow: 'auto',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
      }}
    >
      {loading ? (
        <TableSkeleton columns={['text', 'avatar', 'text', 'text', 'text', 'text']} rows={5} />
      ) : (
        <StyledTable
          columns={allColumns.filter((column) => column.showFor.includes(tabName))}
          rows={
            data.map((shop, i) => {
              shop.rowNumber = i + 1;
              return shop;
            }) || []
          }
          getRowHeight={() => 'auto'}
          getRowId={(row) => row?._id}
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: 'defualt',
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Shop Found
              </Stack>
            ),
          }}
        />
      )}

      <ConfirmModal
        message="Are you sure you want to delete this resource?"
        isOpen={isConfirmModal}
        loading={editSellerQuery?.isLoading}
        onCancel={() => {
          setIsConfirmModal(false);
          setCurrentDocumet({});
        }}
        onConfirm={() => {
          removeDocument(currentDocumet);
        }}
      />

      <Modal open={props?.editDocumentOpen} onClose={() => props?.setEditDocumentOpen(false)}>
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
            loading={editSellerQuery.isLoading}
            document={currentDocumet}
            onClose={() => {
              props?.setEditDocumentOpen(false);
              setCurrentDocumet({});
            }}
            onReplaceDoc={replaceDocument}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default ShopList;
