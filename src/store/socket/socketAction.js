import { io } from 'socket.io-client';
import getCookiesAsObject from '../../helpers/cookies/getCookiesAsObject';
import { SOCKET_CONNECTION } from '../../network/Api';
import * as actionType from '../actionType';

export const socketConnect = () => async (dispatch, getState) => {
  const { socket: oldSocket } = getState().socketReducer;

  let accessToken;

  if (document.cookie.length) {
    const { access_token } = getCookiesAsObject();
    accessToken = access_token || null;
  }

  if (!oldSocket) {
    try {
      dispatch({
        type: actionType.SOCKET_CONNECT_SEND,
      });

      const socket = io(SOCKET_CONNECTION, {
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        console.log('socket connected');
        dispatch({
          type: actionType.SOCKET_CONNECT_SUCCESS,
          payload: socket,
        });

        socket.emit('join_drop', {
          token: accessToken,
          type: 'admin',
          platform: 'app',
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
