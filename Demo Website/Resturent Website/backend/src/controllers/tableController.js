import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';

export const getTables = async (req, res, next) => {
  try {
    const query = {};
    if (req.tenantId) query.restaurantId = req.tenantId;
    const tables = await Table.find(query);
    res.json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    next(error);
  }
};

export const createTable = async (req, res, next) => {
  try {
    const restaurantId = req.tenantId || req.user.restaurantId;
    const table = await Table.create({ ...req.body, restaurantId });
    res.status(201).json({ success: true, data: table });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    const query = {};
    if (req.tenantId) query.restaurantId = req.tenantId;
    const reservations = await Reservation.find(query).sort({ date: 1, time: 1 });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

export const createReservation = async (req, res, next) => {
  try {
    const restaurantId = req.tenantId || req.body.restaurantId;
    const reservation = await Reservation.create({ ...req.body, restaurantId, status: 'confirmed' });
    res.status(201).json({ success: true, message: 'Table reserved successfully.', data: reservation });
  } catch (error) {
    next(error);
  }
};
