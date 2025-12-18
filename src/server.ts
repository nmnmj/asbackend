import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { initSocket } from './config/socket';

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = initSocket(server);

  app.set('io', io);

  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();
