import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';

import prisma from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dataRoutes from './routes/dataRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

const PORT = process.env.PORT || 5000;

const connectedUsers = new Map();

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FarmConnect API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/data', dataRoutes);

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// WebSockets Implementation
io.on('connection', (socket) => {
  let currentUserId = null;

  socket.on('register', (userId) => {
    currentUserId = userId;
    connectedUsers.set(userId, socket.id);
    // Broadcast to everyone that this user is online
    io.emit('user_status', { userId, isOnline: true });
  });

  socket.on('typing', ({ receiverId, isTyping }) => {
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing_status', { senderId: currentUserId, isTyping });
    }
  });

  socket.on('mark_read', async ({ messageIds, senderId }) => {
    try {
      await prisma.message.updateMany({
        where: { id: { in: messageIds } },
        data: { read: true }
      });
      // Notify the person who sent them that they have been read
      const senderSocketId = connectedUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messages_read', messageIds);
      }
    } catch(e) { console.error(e); }
  });

  socket.on('check_status', (queryIds, callback) => {
    const statuses = {};
    if (Array.isArray(queryIds)) {
      queryIds.forEach(id => {
        statuses[id] = { isOnline: connectedUsers.has(id), lastSeen: new Date() }; // mock lastSeen dynamically
      });
    }
    if (typeof callback === 'function') callback(statuses);
  });

  socket.on('disconnect', () => {
    if (currentUserId) {
      connectedUsers.delete(currentUserId);
      io.emit('user_status', { userId: currentUserId, isOnline: false, lastSeen: new Date() });
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, () => {
  console.log(`Server running safely on port ${PORT}`);
});
