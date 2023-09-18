import { io } from 'socket.io-client';

// const SOCKET_URL = 'https://efe3-103-86-201-146.ngrok-free.app/';
// const SOCKET_URL = 'https://2d82-103-86-201-151.ngrok-free.app';
const SOCKET_URL = 'https://request-dev.lyxa.delivery';

class WSService {
  initializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
      console.log('initializing socket', this.socket);

      this.socket.on('connect', () => {
        console.log('=== socket connected ====');
      });

      this.socket.on('disconnect', () => {
        console.log('=== socket disconnected ====');
      });

      this.socket.on('error', (data) => {
        console.log('socekt error', data);
      });
    } catch (error) {
      console.log('scoket is not inialized', error);
    }
  };

  emit(event, data = {}) {
    this.socket?.emit(event, data);
  }

  on(event, cb) {
    this.socket?.on(event, cb);
  }

  close() {
    this.socket?.close();
  }

  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
}

const socketServices = new WSService();

export default socketServices;
