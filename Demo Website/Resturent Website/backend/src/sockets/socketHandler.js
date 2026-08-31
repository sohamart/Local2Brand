export const initSocketServer = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client Connected: ${socket.id}`);

    // Join Restaurant Room for Owner / Kitchen KDS
    socket.on('join_restaurant', (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined restaurant_${restaurantId}`);
    });

    // Join Order Room for Live Customer Tracking
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined order_${orderId}`);
    });

    // Status Advance trigger
    socket.on('advance_order_status', ({ orderId, restaurantId, status }) => {
      io.to(`order_${orderId}`).emit('status_updated', { orderId, status });
      io.to(`restaurant_${restaurantId}`).emit('order_updated', { orderId, status });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client Disconnected: ${socket.id}`);
    });
  });
};
