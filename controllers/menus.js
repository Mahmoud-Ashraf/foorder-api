const Menu = require('../models/menu');
const Resturant = require('../models/resturant');
const { validationResult } = require("express-validator");
const user = require('../models/user');
// const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;


exports.getMenu = (req, res, next) => {
    const currentPage = req.query.page || 1;
    let perPage = req.query.perPage || 2;
    let resturantId = req.query.resturantId || '';
    console.log(resturantId, typeof (resturantId));
    // let resturantId = new ObjectId((req.query.resturantId.length < 12) ? "123456789012" : req.query.resturantId);
    let filter = req.query.filter || '';
    let totalItems;
    const regex = new RegExp(filter, 'i') // i for case insensitive
    if (resturantId === '') {
        Menu.find({
            name: { $regex: regex }
        })
            .countDocuments()
            .then(count => {
                if (perPage == 0) {
                    perPage = count;
                }
                totalItems = count;
                return Menu.find({
                    name: { $regex: regex }
                })
                    .skip((currentPage - 1) * perPage)
                    .limit(perPage)
            })
            // .populate('menu')
            .then(menu => {
                res
                    .status(200)
                    .json({ message: 'menu fetched', menu: menu, currentPage: parseInt(currentPage), perPage: parseInt(perPage), totalItems: totalItems });
                // res.end();
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    }
    else {
        Menu.find({
            $and: [
                { name: { $regex: regex } },
                { resturantId: resturantId },
                // '_id': { $in: [
                //     mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
                //     mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
                //     mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
                // ]}
            ],
        })
            .countDocuments()
            .then(count => {
                // if (count === 0) {
                //     // const error = new Error('No Menu Found');
                //     // error.statusCode = 200;
                //     // throw error;
                //     res
                //         .status(200)
                //         .json({ message: 'No Menu Found', menu: [], totalItems: 0 })
                // }
                if (perPage == 0) {
                    perPage = count;
                }
                totalItems = count;
                resturantId = (req.query.resturantId.length < 12) ? "" : req.query.resturantId
                return Menu.find({
                    $and: [
                        { name: { $regex: regex } },
                        { resturantId: resturantId }
                    ],
                })
                    .skip((currentPage - 1) * perPage)
                    .limit(perPage)
            })
            // .populate('menu')
            .then(menu => {
                res
                    .status(200)
                    .json({ message: 'menu fetched', menu: menu, currentPage: parseInt(currentPage), perPage: parseInt(perPage), totalItems: totalItems });
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    }
};

exports.getMenuItem = (req, res, next) => {
    // console.log(req.params.menuItemId);
    const menuItemId = req.params.menuItemId;
    Menu.findById(menuItemId)
        .populate('resturantId')
        .then(menuItem => {
            if (!menuItem) {
                const error = new Error('Could not find a order');
                error.statusCode = 404;
                throw error;
            }
            // console.log('mahmoud', menuItem)
            res
                .status(200)
                .json(menuItem);
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.addMenuItem = (req, res, next) => {
    // console.log('menu request', req);
    console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Faild, Enter data in correct format');
        error.statusCode = 422;
        throw error;
        // res.status(422).json({
        //   message: "Validation Faild, Enter data in correct format",
        //   errors: errors.array(),
        // });
        // console.log('hello', res);
    }
    const name = req.body.name;
    const price = req.body.price;
    // const count = req.body.count;
    // const resturant = req.body.resturantId;
    // console.log(req);
    let joinResturant;

    const menuItem = new Menu(req.body);
    menuItem.save()
        .then(menuItem => {
            // let menuItem = req.body;
            // menuItem.id = new Date().toISOString();
            // Create menuItem in db
            // 201 status code means created in db
            // 200 status code means just success
            return Resturant.findById(req.body.resturantId);
        })
        .then(resturant => {
            // console.log('resturaaaaant', resturant);
            joinResturant = resturant;
            resturant.menu.push(menuItem);
            return resturant.save();
        })
        .then(result => {
            res.status(201).json({
                message: "menuItem added successfully",
                menuItem: menuItem,
                resturant: { _id: joinResturant._id, name: joinResturant.name }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.updateMenuItem = (req, res, next) => {
    const menuItemId = req.params.menuItemId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Faild, Enter data in correct format');
        error.statusCode = 422;
        throw error;
        // res.status(422).json({
        //   message: "Validation Faild, Enter data in correct format",
        //   errors: errors.array(),
        // });
        // console.log('hello', res);
    }
    const name = req.body.name;
    const price = req.body.price;
    Menu.findById(menuItemId)
        .then(menuItem => {
            if (!menuItem) {
                const error = new Error('Could not find a menuItem');
                error.statusCode = 404;
                throw error;
            }
            menuItem.name = name;
            menuItem.price = price;
            return menuItem.save();
        })
        .then(result => {
            return res.status(200).json({ message: 'menuItem updat success', menuItem: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteMenuItem = (req, res, next) => {
    const menuItemId = req.params.menuItemId;
    let resturantId;
    Menu.findById(menuItemId)
        .then(menuItem => {
            if (!menuItem) {
                const error = new Error('Could not find a menuItem');
                error.statusCode = 404;
                throw error;
            }
            resturantId = menuItem.resturantId;
            return Menu.findByIdAndRemove(menuItemId);
        })
        .then(result => {
            return Resturant.findById(resturantId);
        })
        .then(resturant => {
            resturant.menu.pull(menuItemId);
            return resturant.save();
        })
        .then(result => {
            return res.status(200).json({ message: 'Menu Item deleted' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
