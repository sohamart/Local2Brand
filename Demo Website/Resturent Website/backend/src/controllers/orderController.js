import Order from '../models/Order.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, customer, orderType, paymentMethod, subtotal, tax, deliveryFee, discount, total, kitchenNotes } = req.body;
    const restaurantId = req.tenantId || req.body.restaurantId;

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      restaurantId,
      customerId: req.user ? req.user._id : null,
      orderNumber,
      customer,
      orderType: orderType || 'delivery',
      items,
      subtotal,
      tax: tax || 0,
      deliveryFee: deliveryFee || 0,
      discount: discount || 0,
      total,
      paymentMethod: paymentMethod || 'razorpay',
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      orderStatus: 'confirmed',
      kitchenNotes
    });

    // Emit live socket event if io is attached
    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.to(`restaurant_${restaurantId}`).emit('new_order', order);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const query = {};
    if (req.tenantId) query.restaurantId = req.tenantId;
    else if (req.user?.restaurantId) query.restaurantId = req.user.restaurantId;

    if (req.user?.role === 'customer') {
      query.customerId = req.user._id;
    }

    if (req.query.status) query.orderStatus = req.query.status;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }] });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.to(`order_${order._id}`).emit('status_updated', order);
      io.to(`restaurant_${order.restaurantId}`).emit('order_updated', order);
    }

    res.json({ success: true, message: 'Order status updated.', data: order });
  } catch (error) {
    next(error);
  }
};
