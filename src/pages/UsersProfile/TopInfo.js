import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import UserProfileInfo2 from '../../components/Common/UserProfileInfo2';
import { getImageUrl } from '../../helpers/images';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { statusColor } from '../ShopProfile/Info';

export default function TopInfo({ user }) {
  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  console.log(user);

  const update = useMutation((data) => AXIOS.post(Api.USER_UPDATE, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries([Api.ALL_USERS]);
        user.profile_photo = data?.data?.user?.profile_photo;
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
      id: user?._id,
      profile_photo: imgUrl,
    });
  };

  return (
    <UserProfileInfo2
      autoGenId={user?.autoGenId}
      image={user?.profile_photo}
      statusColor={user?.status === 'active' ? statusColor?.green : statusColor?.yellow}
      statusTooltip={user?.status}
      name={user?.name}
      reviews={user?.reviews}
      phone={user?.phone_number}
      onDrop={onDrop}
      rating={0}
    />
  );
}
