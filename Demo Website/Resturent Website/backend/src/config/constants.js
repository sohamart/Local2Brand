export const ROLES = {
  DEVELOPER: 'developer',
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const PAYMENT_METHODS = {
  RAZORPAY: 'razorpay',
  COD: 'cod',
  UPI_QR: 'upi_qr'
};

export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};
