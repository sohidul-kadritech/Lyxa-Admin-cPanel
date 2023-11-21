/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { getQueryParamsInit } from '../helper';
import ReviewTable from './ReviewTable';

const searchReviews = (reviews, queryParams) => {
  const items = [];

  reviews?.forEach((review) => {
    if (moment(review.createdAt).isBefore(queryParams.startDate)) return;
    if (moment(review.createdAt).isAfter(queryParams.endDate)) return;

    if (!queryParams?.searchKey) {
      items?.push(review);
      return;
    }

    if (review?.reviewDes?.toLowerCase()?.includes(queryParams?.searchKey?.toLowerCase())) {
      items.push(review);
      return;
    }

    let included = false;

    review?.reviewTags?.forEach((tag) => {
      if (tag?.toLowerCase()?.includes(queryParams?.searchKey?.toLowerCase()) && !included) {
        items.push(review);
        included = true;
      }
    });
  });

  items?.sort((a, b) => {
    if (moment(a?.createdAt).isBefore(b?.createdAt)) return queryParams?.sortBy === 'DESC' ? 1 : -1;
    if (moment(a?.createdAt).isAfter(b?.createdAt)) return queryParams?.sortBy === 'DESC' ? -1 : 1;
    return 0;
  });

  return items;
};

export default function ShopReviews({ shop, onViewDetail }) {
  const [queryParams, setQueryParams] = useState(getQueryParamsInit());
  // const [filteredReviews, setFilteredReviews] = useState(reviews);

  const shopReviewsQuery = useQuery([API_URL.GET_SHOP_REVIEWS, { shopId: shop?._id, ...queryParams }], () =>
    AXIOS.get(API_URL.GET_SHOP_REVIEWS, {
      params: {
        shopId: shop?._id,
        ...queryParams,
      },
    }),
  );

  console.log('shopReviewsQuery', { shopReviewsQuery: shopReviewsQuery?.data?.data });

  return (
    <Box>
      <SearchBar
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        searchPlaceHolder="Search Reviews"
        showFilters={{ search: true, date: true, sort: true }}
      />
      <ReviewTable
        reviews={[]}
        setFilteredReviews={[]}
        onViewDetail={onViewDetail}
        loading={shopReviewsQuery?.isLoading}
      />
    </Box>
  );
}
