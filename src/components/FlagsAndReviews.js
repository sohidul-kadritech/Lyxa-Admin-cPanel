import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DeleteOrderFlag } from '../store/order/orderAction';
import Info from './Info';

function FlagsAndReviews({ flags = [], isFromOrder = false, isReview = false, reviews = [] }) {
  const dispatch = useDispatch();

  return (
    <Accordion className="mb-4">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>{!isReview ? 'Flags' : 'Order Reviews'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          {flags.length > 0 || reviews.length > 0 ? (
            <>
              <div className="d-flex">
                <h5>{isFromOrder ? 'Account' : 'Order ID'}</h5>
                <h5 style={{ marginLeft: '120px' }}>{!isReview ? 'Comments' : 'Order Reviews'}</h5>
                {isReview && <h5 style={{ marginLeft: '140px' }}>Rating</h5>}
              </div>
              <FlagsWrapper>
                {!isReview
                  ? flags.length > 0 &&
                    flags.map((item) => (
                      <div key={Math.random()} className="d-flex">
                        <div className="info_wrapper">
                          <Info
                            title={
                              isFromOrder
                                ? item?.user
                                  ? 'User'
                                  : item?.shop
                                  ? 'Shop'
                                  : 'Delivery Boy'
                                : item?.orderId?.orderId
                            }
                            value={!item?.comment ? 'No Flag' : item?.comment}
                            flagOrderRoute={!isFromOrder && `/orders/details/${item?.orderId?._id}`}
                          />
                        </div>
                        {isFromOrder && (
                          <div className="delete_btn_wrapper" onClick={() => dispatch(DeleteOrderFlag(item?._id))}>
                            <i className="fa fa-trash cursor-pointer"></i>
                          </div>
                        )}
                      </div>
                    ))
                  : reviews.map((item) => (
                      <div key={Math.random()} className="d-flex">
                        <div className="info_wrapper">
                          <Info
                            title={item?.order?.orderId}
                            value={!item?.review ? 'No Review' : item?.review}
                            valueTwo={item?.rating}
                            flagOrderRoute={!isFromOrder && `/orders/details/${item?.order?._id}`}
                          />
                        </div>
                      </div>
                    ))}
              </FlagsWrapper>
            </>
          ) : (
            <h5 className="text-center">No Data!</h5>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

const FlagsWrapper = styled.div`
  .info_wrapper {
    flex: 1;
  }
  .delete_btn_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 3px;

    .fa-trash {
      color: red;
    }
  }
`;

export default FlagsAndReviews;
