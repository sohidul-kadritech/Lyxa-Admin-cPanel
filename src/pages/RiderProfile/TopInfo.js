import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import CameraIconButton from '../../components/Common/CameraIconButton';
import Rating from '../../components/Common/Rating';
import { getImageUrl } from '../../helpers/images';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

export default function TopInfo({ rider }) {
  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  // add rider
  const update = useMutation((data) => AXIOS.post(Api.EDIT_DELIVERY_MAN, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries([Api.ALL_DELIVERY_MAN]);
        rider.image = data?.data?.delivery?.image;
        setRender((prev) => !prev);
        console.log(data);
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
    <Stack direction="row" gap="20px">
      <Box sx={{ position: 'relative' }}>
        <Avatar alt="Shop" variant="circular" src={rider?.image} sx={{ width: 100, height: 100 }}>
          {rider?.name
            ?.split(' ')
            .reduce((prev, cur) => prev + cur.charAt(0), '')
            .slice(0, 3)}
        </Avatar>
        <CameraIconButton
          sx={{
            position: 'absolute',
            bottom: '0px',
            right: '-5px',
          }}
          onFileSelect={(e) => {
            onDrop(e.target.files);
          }}
        />
      </Box>
      <Stack justifyContent="center">
        <Typography variant="h2" sx={{ fontSize: '30px', fontWeight: 500 }}>
          {rider?.name}
        </Typography>
        <Typography
          pt={1}
          variant="inherit"
          sx={{
            color: 'text.secondary2',
            fontSize: '20px',
            fontWeight: 500,
          }}
        >
          # {rider?.autoGenId}
        </Typography>
        <Stack direction="row" alignItems="center" pt={1} gap={1}>
          <Rating amount={rider?.rating} />
          <Typography variant="body1" color="text.secondary2">
            ({rider?.reviews?.length <= 100 ? `${rider?.reviews?.length}` : `100+`} Reviews)
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

// function InfoItem({ text, isFirst }) {
//   return (
//     <Box
//       className={isFirst ? 'first' : ''}
//       sx={{
//         paddingLeft: '12px',
//         paddingRight: '12px',
//         position: 'relative',

//         '&::before': {
//           content: "''",
//           display: 'block',
//           width: '5px',
//           height: '5px',
//           backgroundColor: 'text.secondary2',
//           borderRadius: '50%',
//           position: 'absolute',
//           left: '0px',
//           top: '50%',
//           transform: 'translate(-50%, -50%)',
//         },

//         '&.first': {
//           paddingLeft: '0px',

//           '&::before': {
//             display: 'none',
//           },
//         },
//       }}
//     >
//       <Typography
//         variant="inherit"
//         sx={{
//           color: 'text.secondary2',
//           fontSize: '20px',
//           fontWeight: 500,
//         }}
//       >
//         {text}
//       </Typography>
//     </Box>
//   );
// }
