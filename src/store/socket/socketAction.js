import socketServices from '../../common/socketService';
import getCookiesAsObject from '../../helpers/cookies/getCookiesAsObject';

export const socketConnect = () => {
  let accessToken;

  if (document.cookie.length) {
    const { access_token } = getCookiesAsObject();
    accessToken = access_token || null;
  }

  socketServices.initializeSocket();

  socketServices?.on('connect', () => {
    socketServices?.emit('join_drop', {
      token: accessToken,
      type: 'admin',
      platform: 'app',
    });
  });
};
