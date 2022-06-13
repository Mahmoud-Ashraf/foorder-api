const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const collectedOrdersController = require("../controllers/collectedOrders");

const isAuth = require('../middleware/is-auth');
router.get("/collected-orders", isAuth, collectedOrdersController.getCollectedOrders);
router.get("/collected-order/:collectedOrderId", isAuth, collectedOrdersController.getCollectedOrder);
router.get('/checkTodayCollectedOrder', isAuth, collectedOrdersController.checkTodayCollectedOrder);
router.post(
  "/collect-order",
  isAuth,
  collectedOrdersController.addCollectedOrder
);
router.put(
  "/update-collected-order/:collectedOrderId",
  isAuth,
  collectedOrdersController.updateCollectedOrder
);

module.exports = router;
