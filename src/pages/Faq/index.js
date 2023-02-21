// mui
import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';

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
                <TableContainer component={Box}>
                  <Table sx={{ width: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Q&A</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ position: 'relative' }}>
                      {/* data found */}
                      {!loading && faq?.length
                        ? faq.map((item) => (
                            <TableRow key={item?._id}>
                              <TableCell>
                                <Stack spacing={1}>
                                  <span>{item?.question}</span>
                                  <span>{item?.ans}</span>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <span className="text-capitalize">{item?.type}</span>
                              </TableCell>
                              <TableCell>
                                <Stack spacing={1}>
                                  <span>{new Date(item?.createdAt).toLocaleDateString()}</span>
                                </Stack>
                              </TableCell>
                              <TableCell align="right">
                                <ThreeDotsMenu
                                  menuItems={['Edit', 'Delete']}
                                  handleMenuClick={(menu) => {
                                    threeDotHandler(menu, item);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        : null}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* loading */}
                {loading ? <CircularLoader /> : null}
                {/* not found */}
                {!loading && !faq?.length && (
                  <Box padding={3} textAlign="center">
                    <Typography>No Item found!</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
          {/* right */}
          <Grid container md={6} className={`${isRightBarOpen ? '' : 'd-none'}`}>
            <Grid xs={12}>
              <Paper>
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
