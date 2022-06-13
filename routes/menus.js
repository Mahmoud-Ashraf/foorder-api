const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const menuController = require("../controllers/menus");

const isAuth = require('../middleware/is-auth');
// GET /menu
router.get("/menu", isAuth, menuController.getMenu);
router.get("/menu/:menuItemId", isAuth, menuController.getMenuItem);

// POST /menuItem
router.post(
    "/menu",
    isAuth,
    [
        body("name", "name is too small min length 3 char.")
            .trim()
            .isLength({ min: 3 }),
        body("price", "content is too small min length 1 char.")
            .trim()
            .isLength({ min: 1 }),
        body('resturantId')
            .not()
            .isEmpty()
    ],
    menuController.addMenuItem
);

router.put("/menu/:menuItemId",
    isAuth,
    [
        body("name", "name is too small min length 3 char.")
            .trim()
            .isLength({ min: 3 }),
        body("price", "content is too small min length 1 char.")
            .trim()
            .isLength({ min: 1 }),
    ],
    menuController.updateMenuItem
);

router.delete("/menu/:menuItemId", isAuth, menuController.deleteMenuItem);

module.exports = router;
