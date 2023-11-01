/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Stack, Typography, debounce, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import StyledFormField from '../../Form/StyledFormField';
import { ProductCard } from './ProductCard';

function StyledProductSelector({ order, onClickProduct }) {
  const [searchKey, setSearchKey] = useState('');
  const [searchedResult, setSearchedResult] = useState([]);

  const theme = useTheme();

  const productsQuery = useMutation(
    () =>
      AXIOS?.get(API_URL.ALL_PRODUCT, {
        params: {
          type: 'all',
          shop: order?.shop?._id,
          inStock: true,
          page: 1,
          pageSize: 10,
          searchKey,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          console.log('data?.data?.products', data?.data?.products);
          setSearchedResult(data?.data?.products);
        }
      },
    },
  );

  const getProducts = useMemo(
    () =>
      debounce((value) => {
        setSearchKey(value);
        productsQuery.mutate();
      }, 100),
    [],
  );

  useEffect(() => {
    function handleClickOutside() {
      setSearchKey('');
    }

    // Attach the click event listener to the document
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Stack
      sx={{
        position: 'relative',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <StyledFormField
        intputType="text"
        inputProps={{
          placeholder: 'Choose Item',
          value: searchKey,
          onChange: (e) => {
            getProducts(e?.target?.value);
          },
        }}
      />

      {searchKey && (
        <Stack
          sx={{
            position: 'absolute',
            top: '55px',
            width: '100%',
            maxHeight: '350px',
            overflow: 'auto',
            background: theme.palette.background.secondary,
            padding: '16px 0px',
            borderRadius: '16px',
            zIndex: 999,
          }}
        >
          {!productsQuery?.isLoading &&
            searchedResult?.map((product, i) => (
              <ProductCard onClickProduct={onClickProduct} product={product} key={i} />
            ))}

          {!productsQuery?.isLoading && !searchedResult?.length && (
            <Stack
              sx={{
                padding: '0px 20px',
              }}
            >
              <Typography variant="h6">No products found</Typography>
            </Stack>
          )}

          {productsQuery?.isLoading && (
            <Stack
              sx={{
                padding: '0px 20px',
              }}
            >
              <Typography variant="h6">Loading...</Typography>
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default StyledProductSelector;
