/* eslint-disable no-unused-vars */
import { Box, Drawer, Modal, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import TablePagination from '../../components/Common/TablePagination';
import { useGlobalContext } from '../../context';
import useQueryParams from '../../helpers/useQueryParams';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddRider from './AddRider';
import RiderLocation from './RiderLocation';
import RidersTable from './RiderTable';
import RidersMapView from './RidersMapView';
import SearchBar from './Searchbar';
import TableSkeleton from './TableSkeleton';
import { getQueryParamsInit } from './helper';

export default function RiderList({ viewUserType }) {
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  console.log(routeMatch);
  console.log({ viewUserType });

  const [queryParams, setQueryParams] = useQueryParams(getQueryParamsInit(viewUserType, shop?._id));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openRidersMapViewModal, setOpenRidersMapViewModal] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentRider, setCurrentRider] = useState({});

  const query = useQuery(
    [Api.ALL_DELIVERY_MAN, queryParams],
    () =>
      AXIOS.get(Api.ALL_DELIVERY_MAN, {
        params: { ...queryParams, zoneId: queryParams?.zoneId === 'all' ? null : queryParams?.zoneId },
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  return (
    <Box pt={9} pb={10}>
      <Typography variant="h4" pb={10}>
        Riders
      </Typography>
      <SearchBar
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        onAdd={() => {
          setSidebarOpen(true);
        }}
        onMapView={() => {
          setOpenRidersMapViewModal(true);
        }}
        searchPlaceHolder={`Search${` ${query?.data?.data?.deliveryBoys?.length || ''}`} items`}
      />
      {query.isLoading && <TableSkeleton />}
      {!query.isLoading && (
        <Box>
          <RidersTable
            rows={query?.data?.data?.deliveryBoys}
            onEdit={(rider) => {
              setCurrentRider(rider);
              setSidebarOpen(true);
            }}
            onLocationView={(rider) => {
              setCurrentRider(rider);
              setModalOpen(true);
            }}
            onProfileView={(rider) => {
              history.push(`${routeMatch?.url}/${rider?._id}`, {
                rider,
              });
            }}
          />
          <TablePagination
            currentPage={Number(queryParams.page)}
            totalPage={totalPage}
            lisener={(page) => {
              console.log(page);
              setQueryParams((prev) => ({ ...prev, page }));
            }}
          />
        </Box>
      )}
      <Drawer open={sidebarOpen} anchor="right">
        <AddRider
          riderFor={viewUserType}
          riderShop={viewUserType === 'shop' ? shop : undefined}
          onClose={() => {
            setSidebarOpen(false);
            setCurrentRider({});
          }}
          editRider={currentRider}
        />
      </Drawer>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCurrentRider({});
        }}
      >
        <Box>
          <RiderLocation
            riderId={currentRider?._id}
            onClose={() => {
              setModalOpen(false);
              setCurrentRider({});
            }}
          />
        </Box>
      </Modal>

      <Modal open={openRidersMapViewModal} centered>
        <Box>
          <RidersMapView onClose={() => setOpenRidersMapViewModal(false)} />
        </Box>
      </Modal>
    </Box>
  );
}
