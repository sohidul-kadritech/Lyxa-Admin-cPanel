import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from 'react-query';
import { connect, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as Api from '../network/Api';
import Axios from '../network/axios';

// api
const fetchFlags = async () => {
  const { data, status } = await Axios.get(Api.GET_ALL_FLAGS, {
    params: {
      model: '',
      type: '',
      resolved: 'false',
      page: 1,
      pageSize: 100,
    },
  });

  return status ? data : {};
};

function Portals() {
  const { pathname } = useLocation();
  const newUnseenChatRequestBadge = useRef();
  const unResolvedFlagsBadge = useRef();
  const [render, setRender] = useState(false);
  const openChats = useSelector((store) => store.chatReducer.openChats);

  const flagsQuery = useQuery(['flagged_orders'], fetchFlags, {
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    newUnseenChatRequestBadge.current = document.getElementById('sidebar-item-chat-badges');
    unResolvedFlagsBadge.current = document.getElementById('sidebar-item-flagged-orders');
    setRender(!render);
  }, [pathname]);
  return (
    <>
      {/* chat notification badge */}
      {newUnseenChatRequestBadge.current && openChats && createPortal(openChats, newUnseenChatRequestBadge.current)}
      {/* unresolved flags badget */}
      {unResolvedFlagsBadge.current &&
        flagsQuery?.data?.list?.length &&
        createPortal(flagsQuery?.data?.list?.length, unResolvedFlagsBadge.current)}
    </>
  );
}

const mapStateToProps = (state) => ({
  openChats: state.chatReducer.openChats,
});

export default connect(mapStateToProps)(Portals);
