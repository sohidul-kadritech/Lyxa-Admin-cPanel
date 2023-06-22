import { Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import EditDocument from '../../../../Common/EditDocument';
import { StyledOrderDetailBox } from '../../helpers';
import ButlerProduct from './Product';

export default function ButlerOrderSummary({ order }) {
  const [editDocumentOpen, setEditDocumentOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState({});

  const quantity = order?.products?.reduce((acc, cur) => acc + cur.quantity, 0) || null;

  const onImagePreview = (imgUrl) => {
    setEditDocumentOpen(true);
    setCurrentDoc({ url: imgUrl });
  };

  return (
    <>
      <StyledOrderDetailBox
        title={
          <span>
            Order Summary
            <span
              style={{
                fontStyle: 'italic',
              }}
            >
              {quantity ? ` x${quantity}` : ''}
            </span>
          </span>
        }
      >
        {order?.orderType === 'delivery_only' && (
          <Typography variant="body2" color="textPrimary" lineHeight="22px">
            {order?.itemDescription}
          </Typography>
        )}
        {order?.orderType === 'purchase_delivery' && (
          <Stack gap={3} pt={2}>
            {order?.products?.map((product, index) => (
              <ButlerProduct product={product} key={index} onImagePreview={onImagePreview} />
            ))}
          </Stack>
        )}
      </StyledOrderDetailBox>
      <Modal open={editDocumentOpen} onClose={() => setEditDocumentOpen(false)}>
        <EditDocument document={currentDoc} onClose={() => setEditDocumentOpen(false)} previewOnly />
      </Modal>
    </>
  );
}
