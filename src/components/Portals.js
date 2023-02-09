import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

function Portals({ openChats }) {
  const { pathname } = useLocation();
  const newUnseenChatRequestBadge = useRef();

  useEffect(() => {
    newUnseenChatRequestBadge.current = document.getElementById('sidebar-item-chat-badges');
  }, [pathname]);

  return (
    <>
      {/* chat notification badge */}
      {newUnseenChatRequestBadge.current && openChats && createPortal({ openChats }, newUnseenChatRequestBadge.current)}
    </>
  );
}

const mapStateToProps = (state) => ({
  openChats: state.chatReducer.openChats,
});

export default connect(mapStateToProps)(Portals);
