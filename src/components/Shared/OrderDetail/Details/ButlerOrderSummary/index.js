import { Box, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useGlobalContext } from '../../../../../context';
import EditDocument from '../../../../Common/EditDocument';
import { StyledOrderDetailBox } from '../../helpers';
import ButlerProduct from './Product';

export default function ButlerOrderSummary({ order }) {
  const quantity = order?.products?.reduce((acc, cur) => acc + cur.quantity, 0) || null;
  const [editDocumentOpen, setEditDocumentOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState({});

  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

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
          <Box>
            <Stack gap={3} pt={2} pb={5}>
              {order?.products?.map((product, index) => (
                <ButlerProduct product={product} key={index} onImagePreview={onImagePreview} />
              ))}
            </Stack>
            <Typography variant="body2" color="textPrimary" lineHeight="22px">
              Note: Estimated total will be{' '}
              <span style={{ fontWeight: 'bold' }}>
                {currency}
                {order?.summary?.productAmount}
              </span>
              . This amount will be paid by <span style={{ fontWeight: 'bold' }}>cash</span>.
            </Typography>
          </Box>
        )}
      </StyledOrderDetailBox>
      <Modal open={editDocumentOpen} onClose={() => setEditDocumentOpen(false)}>
        <EditDocument document={currentDoc} onClose={() => setEditDocumentOpen(false)} previewOnly />
      </Modal>
    </>
  );
}
