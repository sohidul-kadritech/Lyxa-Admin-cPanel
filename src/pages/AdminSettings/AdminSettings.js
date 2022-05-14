import { TextField } from "@mui/material";
import React, { useEffect } from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Row,Spinner } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import { useDispatch, useSelector } from 'react-redux';
import { getAllAdminSettings, updateAdminSettings, updateGoogleMapApiKey } from "../../store/AdminSettings/adminSettingsAction";
import { toast } from "react-toastify";

const AdminSettings = () => {

  const dispatch = useDispatch();

  const {googleMapKey, loading} = useSelector(state => state.adminSettingsReducer)


  useEffect(()=>{
    dispatch(getAllAdminSettings())
  },[])

  const updateSettings = () =>{
    if(!googleMapKey){
      return toast.warn("Add Google Map Key", {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    dispatch(updateAdminSettings())
  }

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
          <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Admin Settings"}
              // loading={loading}
              // callList={callCuisineList}
            />


            <Card>
              <CardBody>
                <CardTitle>Informations</CardTitle>
                <hr />
                <Row>
                  <Col lg={6}>
                  <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Google Map Key"
                      variant="outlined"
                      placeholder="Enter Google Map Key"
                      value={googleMapKey}
                      onChange={(e) => dispatch(updateGoogleMapApiKey(e.target.value))}
                      required
                    />
                  </Col>
                </Row>

                <div className='d-flex justify-content-center mt-5 mb-2'>
                  <Button color='success' style={{padding: '10px 50px'}} onClick={updateSettings}>
                    {loading ? <Spinner animation='border' variant='success' size='sm'></Spinner> : "UPDATE"}
                  </Button>
                </div>
              </CardBody>
            </Card>

          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default AdminSettings;
