/* eslint-disable no-unused-vars */
import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { ReactComponent as DropIcon } from '../../assets/icons/down.svg';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

export default function EditFavorite({ onClose }) {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const [title, setTitle] = useState('');

  const favoritesMutation = useMutation(
    (status) =>
      AXIOS.post(Api.EDIT_SHOP_FAVOVRITES, {
        shopId: shop?._id,
        title,
      }),
    {
      onSuccess: () => {
        shop.shopFavourites.title = title;
        onClose();
      },
    }
  );

  const onSubmit = () => {
    if (title?.trim() === '') {
      successMsg('Please enter a valid title');
      return;
    }

    favoritesMutation.mutate();
  };

  return (
    <SidebarContainer title="Rename Favorite" onClose={onClose}>
      <Box>
        <StyledFormField
          label="Previous Name"
          intputType="text"
          inputProps={{
            type: 'text',
            name: 'title',
            value: shop?.shopFavourites?.title || '',
            readOnly: true,
          }}
        />
        <StyledFormField
          label="New Name"
          intputType="text"
          inputProps={{
            type: 'text',
            name: 'title',
            value: title,
            placeholder: 'ex: All Time Favorites',
            onChange: (e) => setTitle(e.target.value),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<DropIcon />}
          fullWidth
          onClick={() => {
            favoritesMutation.mutate();
          }}
          disabled={favoritesMutation?.isLoading}
          sx={{
            marginTop: '20px',
          }}
        >
          Save
        </Button>
      </Box>
    </SidebarContainer>
  );
}
