const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS ayarı çok önemli, yoksa Flutter bağlanamaz!
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log('Yeni cihaz bağlandı:', socket.id);

  socket.on('join', (roomId) => socket.join(roomId));
  socket.on('offer', (data) => socket.to(data.room).emit('offer', data));
  socket.on('answer', (data) => socket.to(data.room).emit('answer', data));
  socket.on('ice-candidate', (data) => socket.to(data.room).emit('ice-candidate', data));
  
  socket.on('disconnect', () => console.log('Cihaz ayrıldı:', socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Sinyal sunucusu ${PORT} portunda çalışıyor`));