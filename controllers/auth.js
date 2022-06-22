const User = require('../models/user');
const { validationResult } = require("express-validator");
// bcryptjs for hash the password
const bcrypt = require('bcryptjs')

// for Json Web Token ( Authentication)
const jwt = require('jsonwebtoken');
// const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Faild, Enter data in correct format');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    // let avatar = '';
    // splitedName = req.body.name.split(' ');
    // splitedName.forEach(namePhrase => {
    //     avatar += namePhrase[0];
    // });
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name,
                voted: false,
                // avatar: avatar
            });
            return user.save();
        }).then(result => {
            const token = jwt.sign({
                // the data which will be sent back to user throw the token
                // exp: Math.floor(Date.now() / 1000) + (60 * 60),
                email: result.email,
                userId: result._id,
                // email: loadedUser.email,
                // userId: loadedUser._id.toString()
            },
                'somesupersecretjwtsecretjwt',
                { expiresIn: '1h' }
            );
            res.status(201).json({
                message: 'user created',
                user: result,
                token: token,
                expiresIn: 3600
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .populate('orders')
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found');
                error.statusCode = 401 // for not authenticated
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('wrong password');
                error.statusCode = 401;
                throw error;
            }
            loadedUser._id = loadedUser._id.toString();
            const token = jwt.sign({
                // the data which will be sent back to user throw the token
                // exp: Math.floor(Date.now() / 1000) + (60 * 60),
                email: loadedUser.email,
                userId: loadedUser._id,
                // email: loadedUser.email,
                // userId: loadedUser._id.toString()
            },
                'somesupersecretjwtsecretjwt',
                { expiresIn: '1h' }
            );
            if (loadedUser.orders.length > 0) {
                loadedUser.todayOrder = loadedUser.orders.reduce((prev, current) => {
                    return (new Date(prev.createdAt) > new Date(current.createdAt)) ? prev : current
                }) //returns object
            }
            // console.log(loadedUser);
            // loadedUser.todayOrder = Math.max.apply(Math, array.map((o) =>  o.createdAt ))
            res.status(200).json({
                token: token,
                expiresIn: 3600, // duration in seconds when it will expire
                user: loadedUser,
                // expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) 
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.getUsers = (req, res, next) => {
    const currentPage = req.query.page || 1;
    let perPage = req.query.perPage || 2;
    let filter = req.query.filter || '';
    let totalItems;
    const regex = new RegExp(filter, 'i') // i for case insensitive
    User.find({
        $or: [
            { name: { $regex: regex } },
            { email: { $regex: regex } },
        ]
    })
        .countDocuments()
        .then(count => {
            if (perPage == 0) {
                perPage = count;
            }
            totalItems = count;
            return User.find({
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } },
                ]
            })
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(users => {
            res
                .status(200)
                .json({ message: 'Users fetched', users: users, totalItems: totalItems, perPage: perPage, currentPage: currentPage });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

};

exports.getUser = (req, res, next) => {
    // console.log(req.params.userId);
    const userId = req.params.userId;
    User.findById(userId)
        .populate('orders')
        .then(user => {
            // console.log('mahmoud', user);
            if (!user) {
                const error = new Error('Could not find a user');
                error.statusCode = 404;
                throw error;
            }
            res
                .status(200)
                .json(user);
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};
exports.updateUser = (req, res, next) => {
    const userId = req.params.userId;
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   const error = new Error('Validation Faild, Enter data in correct format');
    //   error.statusCode = 422;
    //   throw error;
    // }
    // const name = req.body.name;
    // const content = req.body.content;
    // const voted = req.body.voted;
    const lastVoteDate = req.body.lastVoteDate;
    const wallet = req.body.wallet;
    const isAdmin = req.body.isAdmin;
    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('Could not find a user');
                error.statusCode = 404;
                throw error;
            }
            // user.name = name;
            // user.content = content;
            // user.voted = voted;
            user.lastVoteDate = lastVoteDate;
            user.wallet = wallet;
            user.isAdmin = isAdmin;
            return user.save();
        })
        .then(result => {
            return res.status(200).json({ message: 'user updated success', user: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}