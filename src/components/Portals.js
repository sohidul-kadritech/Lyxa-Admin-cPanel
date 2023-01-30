import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";
// import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {connect} from 'react-redux'

function Portals({newUnseenChatRequests}) {
  const location = useLocation();
  const newUnseenChatRequestBadge = useRef();

  useEffect(() => {
    newUnseenChatRequestBadge.current = document.getElementById("sidebar-item-chat-badges");
  }, [location]);

  return (
    <React.Fragment>
      {/* chat notification badge */}
      {
        newUnseenChatRequestBadge.current && newUnseenChatRequests && (createPortal(<>{newUnseenChatRequests}</>, newUnseenChatRequestBadge.current))
      }
    </React.Fragment>
  );
}


const mapStateToProps = state => ({
  newUnseenChatRequests: state.chatReducer.newUnseenChatRequests,
});

export default connect(mapStateToProps)(Portals);


