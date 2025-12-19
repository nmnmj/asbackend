import { Server, Socket } from 'socket.io';
import http from 'http';
import { verifyToken } from '../utils/jwt';

interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
  };
}

const connectedUsers = new Map<string, string>();
// userId -> socketId

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  /**
   * 🔐 JWT Authentication Middleware
   */
  io.use((socket: AuthenticatedSocket, next) => {
    const authHeader = socket.handshake.auth?.token;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new Error('Unauthorized'));
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = verifyToken(token);
      socket.data.userId = payload.userId;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  /**
   * 🔌 Connection Handler
   */
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.data.userId;

    socket.join(userId);
    connectedUsers.set(userId, socket.id);

    console.log(`✅ Socket connected: ${socket.id}`);
    console.log(`👤 User joined: ${userId}`);
    console.log('📌 Connected users:', [...connectedUsers.keys()]);

    socket.onAny((event, payload) => {
      console.log('🔥 onAny EVENT:', event, payload);
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);

      console.log(`❌ Socket disconnected: ${socket.id}`);
      console.log('📌 Connected users:', [...connectedUsers.keys()]);
    });
  });

  return io;
};
