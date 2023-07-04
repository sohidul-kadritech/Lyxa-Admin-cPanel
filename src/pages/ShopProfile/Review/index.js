import { Box } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import SearchBar from '../../../components/Common/CommonSearchbar';
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

export default function ShopReviews({ reviews = [], onViewDetail }) {
  const [queryParams, setQueryParams] = useState(getQueryParamsInit());
  const [filteredReviews, setFilteredReviews] = useState(reviews);

  useEffect(() => {
    setFilteredReviews(searchReviews(reviews, queryParams));
  }, [queryParams]);

  useEffect(() => {
    setQueryParams(getQueryParamsInit());
  }, [reviews]);

  return (
    <Box>
      <SearchBar
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        searchPlaceHolder="Search Reviews"
        hideFilters={{ button: true, status: true, menu: true }}
      />
      <ReviewTable reviews={filteredReviews} onViewDetail={onViewDetail} />
    </Box>
  );
}
