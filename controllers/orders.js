const Order = require('../models/order');
const User = require('../models/user');
const { validationResult } = require("express-validator");

// exports.getOrders = (req, res, next) => {
//   const currentPage = req.query.page || 1;
//   const perPage = req.query.perPage || 2;
//   let totalItems;
//   Order.find().countDocuments()
//     .then(count => {
//       totalItems = count;
//       return Order.find()
//         .skip((currentPage - 1) * perPage)
//         .limit(perPage);
//     })
//     .then(orders => {
//       res
//         .status(200)
//         .json({ message: 'orders fetched', orders: orders, totalItems: totalItems, perPage: perPage, currentPage: currentPage });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     })
// };

// exports.getOrder = (req, res, next) => {
//   // console.log(req.params.orderId);
//   const orderId = req.params.orderId;
//   Order.findById(orderId)
//     .then(order => {
//       if (!order) {
//         const error = new Error('Could not find a order');
//         error.statusCode = 404;
//         throw error;
//       }
//       // console.log('mahmoud', order)
//       res
//         .status(200)
//         .json(order);
//     }).catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     })
// };

exports.addOrder = (req, res, next) => {
  // console.log('order req', req);
  console.log(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate());
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Faild, Enter data in correct format');
    error.statusCode = 422;
    throw error;
  }
  if (req.body.items.length <= 0) {
    const error = new Error('You haven\'t any Items to add');
    error.statusCode = 404;
    throw error;
  }
  let addedOrder;
  const order = new Order({
    userId: req.body.userId,
    resturantId: req.body.resturantId,
    items: req.body.items,
    totalOrderPrice: req.body.totalOrderPrice,
    createdOn: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
  });
  // console.log(order);
  Order.find({ userId: req.body.userId, createdOn: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() })
    .then(orders => {
      console.log(orders);
      if (orders.length > 0) {
        const error = new Error('You already have an order today');
        error.statusCode = 404;
        throw error;
      }
      return order.save();
    })
    .then(order => {
      return order.populate('items');
      // let order = req.body;
      // order.id = new Date().toISOString();
      // Create order in db
      // 201 status code means created in db
      // 200 status code means just success
    })
    .then(populatedOrder => {
      addedOrder = populatedOrder;
      return User.findById(req.body.userId);
    })
    .then(user => {
      user.orders.push(order);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "order added successfully",
        order: addedOrder,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

// exports.updateOrder = (req, res, next) => {
//   const orderId = req.params.orderId;
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
//   const name = req.body.name;
//   const content = req.body.content;
//   Order.findById(orderId)
//     .then(order => {
//       if (!order) {
//         const error = new Error('Could not find a order');
//         error.statusCode = 404;
//         throw error;
//       }
//       order.name = name;
//       order.content = content;
//       return order.save();
//     })
//     .then(result => {
//       return res.status(200).json({ message: 'order updat success', order: result });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     })
// }

// exports.deleteOrder = (req, res, next) => {
//   const orderId = req.params.orderId;
//   Order.findById(orderId)
//     .then(order => {
//       if (!order) {
//         const error = new Error('Could not find a order');
//         error.statusCode = 404;
//         throw error;
//       }
//       return Order.findByIdAndRemove(orderId);
//     })
//     .then(result => {
//       return res.status(200).json({ message: 'order deleted', order: result });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     })
// }

// exports.getAllOrder = (req, res, next) => {
//   const orderId = req.params.orderId;
//   Order
//     .findById(orderId)
//     .populate('items')
//     .exec(function (err, order) {
//       if (err) return handleError(err);
//       // console.log('The order is', order);
//     });
// }

exports.getUserOrders = (req, res, next) => {
  const userId = req.params.userId;
  Order.find({ userId: userId })
    .populate('resturantId', 'name')
    // .populate(['resturantId', 'items'])
    .populate('items.item')
    .then(orders => {
      // let updatedOrders = [];
      // orders.forEach(order => {
      // let updatedOrder = order;
      // let orderItems = [];
      // order.items.forEach(item => {
      //   if (orderItems?.some(orderItem => item._id === orderItem._id)) {
      //     orderItems[orderItems.findIndex(orderItem => item._id === orderItem._id)].count += 1;
      //   } else {
      //     item.count = 1;
      //     orderItems.push(item);
      //   }
      // })
      //   updatedOrder.items = orderItems;
      //   updatedOrders.push(updatedOrder);
      // })
      res
        .status(200)
        .json(orders);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.getTodayOrders = (req, res, next) => {
  Order.find({ createdOn: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), resturantId: req.params.resturantId })
    .populate(['resturantId', 'userId', 'items.item'])
    .then(todayorders => {
      if (!todayorders) {
        console.log(todayorders);
        const error = new Error('Could not find any orders');
        error.statusCode = 404;
        throw error;
      }
      if (!(todayorders.length > 0)) {
        res
          .status(200)
          .json({ message: 'No Orders Found' });
      } else {
        todayorders.forEach(order => {
          order.items.forEach(item => {
            item._id = item.item._id;
          })
        })
        res
          .status(200)
          .json({ orders: todayorders, resturant: todayorders[0].resturantId });
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.updateTodayOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Faild, Enter data in correct format');
    error.statusCode = 422;
    throw error;
  }
  const taxFees = req.body.taxFees;
  const deliveryFees = req.body.deliveryFees;
  const discount = req.body.discount;
  const grandTotal = req.body.grandTotal;
  const status = req.body.status;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        const error = new Error('Could not find a Order');
        error.statusCode = 404;
        throw error;
      }
      order.taxFees = taxFees;
      order.deliveryFees = deliveryFees;
      order.discount = discount;
      order.grandTotal = grandTotal;
      order.status = status;
      return order.save();
    })
    .then(result => {
      return res.status(200).json({ message: 'Order update success', order: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}
