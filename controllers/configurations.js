const Configurations = require('../models/configuration');
const { validationResult } = require("express-validator");

exports.getConfigs = (req, res, next) => {
    Configurations.find()
        .then(config => {
            res
                .status(200)
                .json({ message: 'Config Fetched', config: config });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

};

exports.updateConfigs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Faild, Enter data in correct format');
        error.statusCode = 422;
        throw error;
    }
    Configurations.findById(req.body._id)
        .then(config => {
            if (!config) {
                const error = new Error('Could not find a resturant');
                error.statusCode = 404;
                throw error;
            }
            config.voteEndTime = req.body.voteEndTime;
            config.orderEndTime = req.body.orderEndTime;
            return config.save();
        })
        .then(result => {
            return res.status(200).json({ message: 'Configurations update success', config: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}