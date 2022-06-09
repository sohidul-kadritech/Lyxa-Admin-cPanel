import { SOCKET_CONNECTION } from "../../network/Api";
import * as actionType from "../actionType";
import io from "socket.io-client";

export const socketConnect = () => async (dispatch, getState) => {
  const { socket: oldSocket } = getState().socketReducer;

  if (!oldSocket) {
    try {
      dispatch({
        type: actionType.SOCKET_CONNECT_SEND,
      });

      const socket = io('www.example.com', {
        transports: ["websocket"],
        query: {
          authorization: "authorization",
          token: localStorage.getItem("accessToken"),
          type: "admin",
          platform: "web",
        },
      });

      console.log({ socket });

      if (socket.connected) {
        socket.on("connect", () => {
          console.log("socket connected");
          dispatch({
            type: actionType.SOCKET_CONNECT_SUCCESS,
            payload: socket,
          });

          socket.emit("online", {
            token: "b",
            type: "admin",
            platform: "web",
          });
        });
      }else {
        console.log("not connect")
        dispatch({
          type: actionType.SOCKET_CONNECT_FAIL,
          payload: "socket not connected",
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.SOCKET_CONNECT_FAIL,
        payload: error.message,
      });
    }
  }
};
