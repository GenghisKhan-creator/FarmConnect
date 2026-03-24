import express from 'express';
import { getOrders, createOrder, updateOrder } from '../controllers/orderController.js';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { getReports, createReport, getNotifications, getMessages, createMessage, handlePresence } from '../controllers/miscController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/orders').get(protect, getOrders).post(protect, createOrder);
router.route('/orders/:id').put(protect, updateOrder);

router.route('/reviews').get(getReviews).post(protect, createReview);

router.route('/reports').get(protect, getReports).post(protect, createReport);

router.route('/notifications').get(protect, getNotifications);

router.route('/messages').get(protect, getMessages).post(protect, createMessage);

router.route('/presence').post(protect, handlePresence);

export default router;
