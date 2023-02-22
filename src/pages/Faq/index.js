/* eslint-disable react/no-unstable-nested-components */
// mui
import { Box, Button, Modal, Paper, Stack, Tab, Tabs, Typography, Unstable_Grid2 as Grid } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

// third party
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// project import
import CircularLoader from '../../components/CircularLoader';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import TabPanel from '../../components/TabPanel';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import { addFaq, deleteFaq, getAllFaq, updateFaq } from '../../store/faq/faqActions';
import AddFaq from './addFaq';

export default function Faq() {
  const dispatch = useDispatch();
  const { faq, loading } = useSelector((store) => store.faqReducer);

  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);
  const [currentFaq, setCurrentFaq] = useState({});
  const [deleteFaqId, setDeleteFaqId] = useState('');

  // get all faqs
  const callGetAllFaq = () => {
    dispatch(getAllFaq());
  };

  // update faq
  const callUpdateFaq = (item) => {
    dispatch(updateFaq(item));
  };

  // add faq
  const callAddFaq = (item) => {
    dispatch(addFaq(item));
  };

  // delete faq
  const callDeleteFaq = () => {
    dispatch(deleteFaq(deleteFaqId));
  };

  // three dot handler
  const threeDotHandler = (menu, item) => {
    if (menu === 'Edit') {
      setIsRightBarOpen(true);
      setCurrentTab(0);
      setCurrentFaq(item);
    }

    if (menu === 'Delete') {
      setIsConfirmModalOpen(true);
      setDeleteFaqId(item?._id);
    }
  };

  // columns
  const columns = [
    {
      id: 1,
      headerName: 'Q&A',
      field: 'question',
      flex: 1,
      renderCell: (params) => (
        <Stack spacing={1}>
          <span>{params?.value}</span>
          <span>{params?.row?.ans}</span>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'Type',
      field: 'type',
      minWidth: 200,
      renderCell: (params) => <span className="text-capitalize">{params?.value}</span>,
    },
    {
      id: 3,
      field: 'createdAt',
      headerName: 'Created',
      minWidth: 200,
      valueFormatter: (params) => {
        console.log(params.value);
        if (!params?.value) {
          return '';
        }
        return new Date(params?.value).toLocaleDateString();
      },
    },
    {
      id: 4,
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <ThreeDotsMenu
          menuItems={['Edit', 'Delete']}
          handleMenuClick={(menu) => {
            threeDotHandler(menu, params?.row);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!currentFaq?._id) {
      setCurrentFaq(faq[0] || {});
    }
  }, [faq]);

  useEffect(() => {
    callGetAllFaq();
  }, []);

  return (
    <GlobalWrapper>
      <Box className="page-content">
        <Breadcrumb
          maintitle="Lyxa"
          breadcrumbItem="Faq"
          loading={loading}
          callList={callGetAllFaq}
          isAddNew
          addNewHandler={() => {
            setIsRightBarOpen(true);
            setCurrentTab(1);
          }}
        />
        {/* modal */}
        <Modal
          open={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
          }}
          sx={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper>
            <Box padding={2}>
              <Typography variant="h6">Are sure about deleting this Q&A ?</Typography>
              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    callDeleteFaq();
                    setIsConfirmModalOpen(false);
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Modal>
        <Grid container spacing={3}>
          {/* left */}
          <Grid md={isRightBarOpen ? 6 : 12} container>
            <Grid md={12}>
              <Paper>
                <Stack sx={{ height: '300px', width: '100%', position: 'relative' }}>
                  <Box sx={{ flexGrow: 1, height: '100%', width: '100%' }}>
                    <DataGrid
                      columns={columns}
                      rows={faq}
                      getRowId={(params) => params?._id}
                      components={{
                        NoRowsOverlay: () => (
                          <Stack height="100%" alignItems="center" justifyContent="center">
                            {loading ? '' : 'No Q&A found'}
                          </Stack>
                        ),
                      }}
                      disableSelectionOnClick
                    />
                    {/* loading */}
                    {loading ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          background: 'rgba(255, 255, 255, 0.7)',
                          left: '0',
                          top: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 9,
                        }}
                      >
                        <CircularLoader />
                      </Box>
                    ) : null}
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          {/* right */}
          <Grid container md={6} className={`${isRightBarOpen ? '' : 'd-none'}`}>
            <Grid xs={12}>
              <Paper>
                <Stack direction="row" justifyContent="space-between" alignItems="center" pr={1}>
                  <Box>
                    {/* tab headers */}
                    <Tabs
                      value={currentTab}
                      onChange={(event, value) => {
                        setCurrentTab(value);
                      }}
                    >
                      <Tab label="Edit FAQ"></Tab>
                      <Tab label="Add New"></Tab>
                    </Tabs>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setIsRightBarOpen(false);
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </Stack>
                {/* tab bodies */}
                <Box>
                  <TabPanel
                    index={0}
                    value={currentTab}
                    containerSx={{
                      padding: '24px 16px',
                    }}
                  >
                    <AddFaq isEdit faq={currentFaq} submitHandler={callUpdateFaq} />
                  </TabPanel>
                  <TabPanel
                    index={1}
                    value={currentTab}
                    containerSx={{
                      padding: '24px 16px',
                    }}
                  >
                    <AddFaq submitHandler={callAddFaq} />
                  </TabPanel>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </GlobalWrapper>
  );
}
