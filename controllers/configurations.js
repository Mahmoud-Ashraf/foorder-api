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

// exports.addResturant = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation Faild, Enter data in correct format');
//     error.statusCode = 422;
//     throw error;
//     // res.status(422).json({
//     //   message: "Validation Faild, Enter data in correct format",
//     //   errors: errors.array(),
//     // });
//     // console.log('hello', res);
//   }

//   // const name = req.body.name;
//   // const content = req.body.type;
//   const resturant = new Resturant(req.body);
//   // const resturant = new Resturant({
//   //   name: name,
//   //   content: content,
//   //   vote: 0
//   // });
//   console.log(resturant);
//   resturant.save()
//     .then(resturant => {
//       // let resturant = req.body;
//       // resturant.id = new Date().toISOString();
//       // Create Resturant in db
//       // 201 status code means created in db
//       // 200 status code means just success
//       res.status(201).json({
//         message: "Resturant added successfully",
//         resturant: resturant,
//       });
//     }).catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     })
// };

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
            config = req.body;
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