const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");
const user = require("../models/user");

router.put("/signup",
    [
        body('name')
            .trim()
            .not()
            .isEmpty(),
        body("email").isEmail().withMessage('Please Enter Valid email')
            .custom((value, { req }) => {
                return user.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('this Email is already exist')
                    }
                })
            })
            .normalizeEmail(),
        body("password")
            .trim()
            .isLength({ min: 8 }),
    ],
    authController.signup
);

router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.get('/user/:userId', authController.getUser);
router.put('/user/:userId', authController.updateUser);

module.exports = router;
