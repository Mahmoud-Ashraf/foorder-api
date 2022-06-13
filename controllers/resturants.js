const Resturant = require('../models/resturant');
const { validationResult } = require("express-validator");

exports.getResturants = (req, res, next) => {
  const currentPage = req.query.page || 1;
  let perPage = req.query.perPage || 2;
  let filter = req.query.filter || '';
  let totalItems;
  const regex = new RegExp(filter, 'i') // i for case insensitive
  Resturant.find({
    $or: [
      { name: { $regex: regex } },
      { type: { $regex: regex } },
    ]
  })
    .countDocuments()
    .then(count => {
      if (perPage == 0) {
        perPage = count;
      }
      totalItems = count;
      return Resturant.find({
        $or: [
          { name: { $regex: regex } },
          { type: { $regex: regex } },
        ]
      })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(resturants => {
      res
        .status(200)
        .json({ message: 'resturant fetched', resturants: resturants, totalItems: totalItems, perPage: parseInt(perPage), currentPage: parseInt(currentPage) });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })

};

exports.getToDayResturant = (req, res, next) => {
  // console.log(req.params.resturantId);
  // const resturantId = req.params.resturantId;
  Resturant.findOne()
    .sort('-vote')
    .exec((err, doc) => {
      // let max = doc.vote;
      // console.log('max', doc);
      // if (!doc) {
      //   const error = new Error('Could not find a resturant');
      //   error.statusCode = 404;
      //   throw error;
      // }
      res
        .status(200)
        .json(doc);
    })
  // Resturant.findById(resturantId)
  //   .then(resturant => {
  //     if (!resturant) {
  //       const error = new Error('Could not find a resturant');
  //       error.statusCode = 404;
  //       throw error;
  //     }
  //     console.log('mahmoud', resturant)
  //     res
  //       .status(200)
  //       .json(resturant);
  //   })
};
exports.getResturant = (req, res, next) => {
  // console.log(req.params.resturantId);
  const resturantId = req.params.resturantId;
  Resturant.findById(resturantId)
    .then(resturant => {
      if (!resturant) {
        const error = new Error('Could not find a resturant');
        error.statusCode = 404;
        throw error;
      }
      // console.log('mahmoud', resturant)
      res
        .status(200)
        .json(resturant);
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

exports.addResturant = (req, res, next) => {
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

  // const name = req.body.name;
  // const content = req.body.type;
  const resturant = new Resturant(req.body);
  // const resturant = new Resturant({
  //   name: name,
  //   content: content,
  //   vote: 0
  // });
  console.log(resturant);
  resturant.save()
    .then(resturant => {
      // let resturant = req.body;
      // resturant.id = new Date().toISOString();
      // Create Resturant in db
      // 201 status code means created in db
      // 200 status code means just success
      res.status(201).json({
        message: "Resturant added successfully",
        resturant: resturant,
      });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

exports.updateResturant = (req, res, next) => {
  const resturantId = req.params.resturantId;
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
  Resturant.findById(resturantId)
    .then(resturant => {
      if (!resturant) {
        const error = new Error('Could not find a resturant');
        error.statusCode = 404;
        throw error;
      }
      console.log(req.body);
      // resturant = req.body;
      resturant.name = req.body.name;
      resturant.type = req.body.type;
      resturant.phone = req.body.phone;
      resturant.savedPhone = req.body.savedPhone;
      resturant.elmenusUrl = req.body.elmenusUrl;
      resturant.lastVotedAt = req.body.lastVotedAt;
      resturant.vote = req.body.vote;
      return resturant.save();
    })
    .then(result => {
      return res.status(200).json({ message: 'resturant updat success', resturant: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.deleteResturant = (req, res, next) => {
  const resturantId = req.params.resturantId;
  Resturant.findById(resturantId)
    .then(resturant => {
      if (!resturant) {
        const error = new Error('Could not find a resturant');
        error.statusCode = 404;
        throw error;
      }
      return Resturant.findByIdAndRemove(resturantId);
    })
    .then(result => {
      return res.status(200).json({ message: 'resturant deleted', resturant: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.resetResturantsVote = (req, res, next) => {
  Resturant.updateMany({}, { vote: 0 })
    .then(resturants => {
      res
        .status(200)
        .json(resturants);
    })
}
