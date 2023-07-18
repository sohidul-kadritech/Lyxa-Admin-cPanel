import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import UserProfileInfo2 from '../../components/Common/UserProfileInfo2';
import { getImageUrl } from '../../helpers/images';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { getRiderStatus, riderStatusColorVariants } from '../Riders/helper';

export default function TopInfo({ rider }) {
  const queryClient = useQueryClient();
  const [, setRender] = useState(false);

  const update = useMutation((data) => AXIOS.post(Api.EDIT_DELIVERY_MAN, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries([Api.ALL_DELIVERY_MAN]);
        rider.image = data?.data?.delivery?.image;
        setRender((prev) => !prev);
      }
    },

    onError: (error) => {
      console.log(error);
      successMsg(error?.message);
    },
  });

  const onDrop = async (acceptedFiles = []) => {
    const files = Array.from(acceptedFiles).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    if (!files?.length) return;

    successMsg('Uploading...');
    const imgUrl = await getImageUrl(files[0]);

    if (!imgUrl) {
      successMsg('Error while uploading image');
      return;
    }

    update.mutate({
      id: rider?._id,
      image: imgUrl,
    });
  };

  return (
    <UserProfileInfo2
      autoGenId={rider?.autoGenId}
      statusColor={riderStatusColorVariants[getRiderStatus(rider)]?.color}
      statusTooltip={getRiderStatus(rider)}
      image={rider?.image}
      name={rider?.name}
      reviews={rider?.reviews}
      phone={rider?.phone}
      onDrop={onDrop}
      rating={rider?.rating}
    />
  );
}
