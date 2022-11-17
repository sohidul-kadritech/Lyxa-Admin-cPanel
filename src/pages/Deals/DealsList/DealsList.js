import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../../components/GlobalWrapper";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDeal,
  getAllDeal,
  updateShopFilter,
} from "../../../store/Deal/dealAction";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { DealsFilterOptions } from "../../../assets/staticData";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TableImgItem from "../../../components/TableImgItem";
import ThreeDotsMenu from "../../../components/ThreeDotsMenu";

const DealsList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, deals, type } = useSelector((state) => state.dealReducer);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");
  const [dealId, setDealId] = useState("");

  useEffect(() => {
    if (type) {
      callDealList(true);
    }
  }, [type]);

  const callDealList = (refresh = false) => {
    dispatch(getAllDeal(refresh));
  };

  // DELETE DEAL

  const handleDelete = () => {
    console.log({ dealId });
    dispatch(deleteDeal(dealId));
  };

  // MENU ITEMS

  const handleMenu = (menu, item) => {
    if (menu === 'Edit') {
      history.push(`/deals/edit/${item._id}`)
    } else {
      setconfirm_alert(true);
      setDealId(item?._id);
    }
  }

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Deal"
              loading={loading}
              callList={callDealList}
              isAddNew={true}
              addNewRoute="deals/add"
            />

            {isOpen && (
              <Lightbox
                mainSrc={selectedImg}
                enableZoom={true}
                imageCaption="img"
                onCloseRequest={() => {
                  setIsOpen(!isOpen);
                }}
              />
            )}

            {success_dlg ? (
              <SweetAlert
                success
                title={dynamic_title}
                onConfirm={() => {
                  setsuccess_dlg(false);
                }}
              >
                {dynamic_description}
              </SweetAlert>
            ) : null}

            <Card>
              <CardBody>
                <Row>
                  <Col md={4}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Status"
                        onChange={(event) =>
                          dispatch(updateShopFilter(event.target.value))
                        }
                      >
                        {DealsFilterOptions.map((item, index) => (
                          <MenuItem key={index} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Table
                  id="tech-companies-1"
                  className="table  table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Image/Name</Th>
                      <Th>Shop Type</Th>
                      <Th>Deal Type</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {deals?.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th>
                            <TableImgItem img={item?.image} name={item?.name} id={item?.autoGenId} />
                          </Th>

                          <Td>{item?.type}</Td>
                          <Td>{`${item?.percentage ?? ""} ${item?.option}`}</Td>
                          <Td style={{ color: item?.status === 'active' ? 'green' : 'red' }}>{item?.status}</Td>
                          <Td>
                            <ThreeDotsMenu
                              handleMenuClick={(menu) =>
                                handleMenu(menu, item)
                              }
                              menuItems={[
                                "Edit",
                                "Delete",
                              ]}
                            />
                            {confirm_alert ? (
                              <SweetAlert
                                title="Are you sure?"
                                warning
                                showCancel
                                confirmButtonText="Yes, delete it!"
                                confirmBtnBsStyle="success"
                                cancelBtnBsStyle="danger"
                                onConfirm={() => {
                                  handleDelete();
                                  setconfirm_alert(false);
                                  setsuccess_dlg(true);
                                  setdynamic_title("Deleted");
                                  setdynamic_description(
                                    "Your file has been deleted."
                                  );
                                }}
                                onCancel={() => setconfirm_alert(false)}
                              >
                                You want to delete this Deal.
                              </SweetAlert>
                            ) : null}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
                {!loading && deals.length < 1 && (
                  <div className="text-center">
                    <h4>No Data</h4>
                  </div>
                )}
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default DealsList;
