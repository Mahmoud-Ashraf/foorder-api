const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const resturantsController = require("../controllers/resturants");

const isAuth = require('../middleware/is-auth');
// GET /resturants
router.get("/resturants", isAuth, resturantsController.getResturants);
router.get("/resturant/:resturantId", isAuth, resturantsController.getResturant);
router.get("/toDayResturant", isAuth, resturantsController.getToDayResturant);

// POST /resturant
router.post(
  "/resturant",
  isAuth,
  [
    body("name", "name is too small min length 4 char.")
      .trim()
      .isLength({ min: 3 }),
    body("type", "Type is too small min length 3 char.")
      .trim()
      .isLength({ min: 3 }),
    body("phone", "You Entered a wrong phone number.")
      .trim()
      .isLength({ min: 5, max: 11 }),
    body("savedPhone", "a phone must be 11 numbers.")
      .trim()
      .isLength({ min: 11, max: 11 }),
  ],
  resturantsController.addResturant
);

router.put("/resturant/:resturantId",
  isAuth,
  [
    body("name", "name is too small min length 4 char.")
      .trim()
      .isLength({ min: 3 }),
    body("type", "Type is too small min length 3 char.")
      .trim()
      .isLength({ min: 3 }),
    body("phone", "You Entered a wrong phone number.")
      .trim()
      .isLength({ min: 5, max: 11 }),
    body("savedPhone", "a phone must be 11 numbers.")
      .trim()
      .isLength({ min: 11, max: 11 }),
  ],
  resturantsController.updateResturant
);

router.delete("/resturant/:resturantId", isAuth, resturantsController.deleteResturant);
router.put("/resetResturantsVote", isAuth, resturantsController.resetResturantsVote);

module.exports = router;
