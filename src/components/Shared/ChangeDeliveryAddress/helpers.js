import { successMsg } from '../../../helpers/successMsg';

export const validateDeliveryAddress = (data) => {
  const status = {
    status: false,
  };

  if (!data?.deliveryAddress?.address) {
    successMsg('Address field is empty!');
    return status;
  }
  if (!data?.deliveryAddress?.apartment) {
    successMsg('Apartment field is empty!');
    return status;
  }

  if (!data?.deliveryAddress?.latitude || !data?.deliveryAddress?.longitude) {
    successMsg('Latitude and longitude is missing !');
    return status;
  }

  if (!data?.deliveryAddress?.addressLabel) {
    successMsg('Address label is missing !');
    return status;
  }

  return { status: true };
};
