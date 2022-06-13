const CollectedOrder = require('../models/collectedOrder');
const { validationResult } = require("express-validator");

exports.getCollectedOrders = (req, res, next) => {
    const currentPage = req.query.page || 1;
    let perPage = req.query.perPage || 2;
    // let filter = req.query.filter || '';
    let totalItems;
    // const regex = new RegExp(filter, 'i') // i for case insensitive
    CollectedOrder.find(
        // {
        //     $or: [
        //         { name: { $regex: regex } },
        //         { type: { $regex: regex } },
        //     ]
        // }
    )
        .countDocuments()
        .then(count => {
            if (perPage == 0) {
                perPage = count;
            }
            totalItems = count;
            return CollectedOrder.find(
                // {
                //     $or: [
                //         { name: { $regex: regex } },
                //         { type: { $regex: regex } },
                //     ]
                // }
            )
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .populate('resturantId')
        })
        .then(collectedOrders => {
            res
                .status(200)
                .json({ message: 'Collected Orders fetched', collectedOrders: collectedOrders, totalItems: totalItems, perPage: parseInt(perPage), currentPage: parseInt(currentPage) });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

};

exports.addCollectedOrder = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Faild, Enter data in correct format');
        error.statusCode = 422;
        throw error;
    }
    if (req.body.length <= 0) {
        const error = new Error('You haven\'t any Order to add');
        error.statusCode = 404;
        throw error;
    }
    CollectedOrder.find({ createdOn: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() })
        .then(orders => {
            if (orders.length > 0) {
                const error = new Error('Sorry you can\'t collect more than an order per day');
                error.statusCode = 404;
                throw error;
            }
            req.body.createdOn = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
            const collectedOrder = new CollectedOrder(req.body);
            return collectedOrder.save()
        })
        .then(collectedOrder => {
            res.status(201).json({
                message: "Collected Order added successfully",
                collectedOrder: collectedOrder,
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.updateCollectedOrder = (req, res, next) => {
    const collectedOrderId = req.params.collectedOrderId;
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
    CollectedOrder.findById(collectedOrderId)
        .then(collectedOrder => {
            if (!collectedOrder) {
                const error = new Error('Could not find an Order');
                error.statusCode = 404;
                throw error;
            }
            collectedOrder.deliveryFees = req.body.deliveryFees;
            collectedOrder.taxFees = req.body.taxFees;
            collectedOrder.status = req.body.status;
            collectedOrder.discount = req.body.discount;
            collectedOrder.total = req.body.total;

            return collectedOrder.save();
        })
        .then(result => {
            return res.status(200).json({ message: 'Collected Order Done success', collectedOrder: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.getCollectedOrder = (req, res, next) => {
    const collectedOrderId = req.params.collectedOrderId;
    CollectedOrder
        .findById(collectedOrderId)
        .populate(['resturantId', 'items.item'])
        .then(collectedOrder => {
            if (!collectedOrder) {
                const error = new Error('Could not find an Order');
                error.statusCode = 404;
                throw error;
            }
            // console.log('mahmoud', resturant)
            res
                .status(200)
                .json(collectedOrder);
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.checkTodayCollectedOrder = (req, res, next) => {

    CollectedOrder.findOne(
        { createdOn: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() }
    )
        .then(collectedOrder => {
            if (collectedOrder) {
                res
                    .status(200)
                    .json({ message: 'You have collected order already', collectedOrder: collectedOrder });
            } else {
                res
                    .status(200)
                    .json({ message: 'you have\'t order for today' })
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

};
