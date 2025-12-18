import { Server } from 'socket.io';
import http from 'http';

const connectedUsers = new Map<string, string>(); 
// userId -> socketId

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(userId);
      connectedUsers.set(userId, socket.id);

      console.log(`User ${userId} joined`);
      console.log('Currently connected users:', [...connectedUsers.keys()]);
    });
    
    socket.onAny((event, payload) => {
      console.log("🔥 onany EVENT:", event, payload);
    });

    socket.on('disconnect', () => {
      // Remove user by socketId
      for (const [userId, sId] of connectedUsers.entries()) {
        if (sId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }

      console.log('Socket disconnected:', socket.id);
      console.log('Currently connected users:', [...connectedUsers.keys()]);
    });
  });

  return io;
};
