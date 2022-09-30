import { SOCKET_CONNECTION } from "../../network/Api";
import * as actionType from "../actionType";
import { io } from "socket.io-client";

export const socketConnect = () => async (dispatch, getState) => {
  const { socket: oldSocket } = getState().socketReducer;

  if (!oldSocket) {
    try {
      dispatch({
        type: actionType.SOCKET_CONNECT_SEND,
      });

      const socket = io(SOCKET_CONNECTION, {
        transports: ["websocket"],
        // query: {
        //     authorization: "authorization",
        //     token: localStorage.getItem('accessToken'),
        //     type: "user",
        //     platform: "web"
        // },
      });



      socket.on("connect", () => {
        console.log("socket connected");
        dispatch({
          type: actionType.SOCKET_CONNECT_SUCCESS,
          payload: socket,
        });

        socket.emit("join_drop", {
          token: localStorage.getItem("accessToken"),
          type: "admin",
          platform: "app",
        });
      });

    } catch (error) {
      dispatch({
        type: actionType.SOCKET_CONNECT_FAIL,
        payload: error.message,
      });
    }
  }
};
