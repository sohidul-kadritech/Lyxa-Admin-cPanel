import React, { useEffect } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import {connect} from 'react-redux'

function Portals({openChats}) {
  const {pathname} = useLocation();
  const newUnseenChatRequestBadge = useRef();

  useEffect(() => {
    newUnseenChatRequestBadge.current = document.getElementById("sidebar-item-chat-badges");
  }, [pathname]);


  return (
    <React.Fragment>
      {/* chat notification badge */}
      {
        newUnseenChatRequestBadge.current && openChats && (createPortal(<>{openChats}</>, newUnseenChatRequestBadge.current))
      }
    </React.Fragment>
  );
}


const mapStateToProps = state => ({
  openChats: state.chatReducer.openChats,
});

export default connect(mapStateToProps)(Portals);


