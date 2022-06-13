const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const ordersController = require("../controllers/orders");

const isAuth = require('../middleware/is-auth');
// GET /orders
// router.get("/orders", isAuth, ordersController.getOrders);
// router.get("/orders/:orderId", isAuth, ordersController.getOrder);
// router.get("/allOrder/:orderId", ordersController.getAllOrder);

// POST /order
router.post(
  "/order",
  isAuth,
  ordersController.addOrder
);

router.put("/updateTodayOrder/:orderId", isAuth, ordersController.updateTodayOrder);

// router.delete("/order/:orderId", isAuth, ordersController.deleteOrder);
router.get('/userOrders/:userId', isAuth, ordersController.getUserOrders);
router.get('/todayOrders/:resturantId', isAuth, ordersController.getTodayOrders);


module.exports = router;
