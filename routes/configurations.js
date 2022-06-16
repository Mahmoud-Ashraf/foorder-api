const express = require("express");

const router = express.Router();

const configController = require("../controllers/configurations");

const isAuth = require('../middleware/is-auth');
// GET /config
router.get("/config", isAuth, configController.getConfigs);

router.put("/config", isAuth, configController.updateConfigs);


module.exports = router;
