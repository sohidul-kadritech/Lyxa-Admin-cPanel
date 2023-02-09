import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardTitle, Col, Container, Row, Spinner } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import {
  getAllAdminSettings,
  updateAdminSettings,
  updateGoogleMapApiKey,
  updateSearchDeliveryBoyKm,
} from '../../store/Settings/settingsAction';

function AdminSettings() {
  const dispatch = useDispatch();

  const { googleMapKey, loading, searchDeliveryBoyKm } = useSelector((state) => state.settingsReducer);

  const [areaChangeKey, setAreaChangeKey] = useState('');

  useEffect(() => {
    dispatch(getAllAdminSettings());
  }, []);

  // DISPATCH AREA SEARCH KEY
  // eslint-disable-next-line no-unused-vars, consistent-return
  const handleKmAdd = (evt) => {
    if (['Enter', 'Tab', ','].includes(evt.key)) {
      evt.preventDefault();

      const value = areaChangeKey.trim();

      if (searchDeliveryBoyKm.length === 3) {
        return toast.warn('Maximum 3 items can add', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      if (value) {
        setAreaChangeKey('');
        dispatch(updateSearchDeliveryBoyKm(value));
      }
    }
  };

  // DISPATCH REMOVE KM
  // eslint-disable-next-line consistent-return
  const updateSettings = () => {
    if (!googleMapKey) {
      return toast.warn('Add Google Map Key', {
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

    dispatch(updateAdminSettings());
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Admin Settings" isRefresh={false} />

          <Card>
            <CardBody>
              <CardTitle>Informations</CardTitle>
              <hr />
              <Row>
                <Col lg={4}>
                  <TextField
                    style={{ width: '100%' }}
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

              <div className="d-flex justify-content-center mt-5 mb-2">
                <Button color="success" style={{ padding: '10px 50px' }} onClick={updateSettings} disabled={loading}>
                  {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : 'UPDATE'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default AdminSettings;
