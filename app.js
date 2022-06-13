const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const resturantsRoutes = require("./routes/resturants");
const authRoutes = require("./routes/auth");
const menuRoutes = require('./routes/menus');
const ordersRoutes = require('./routes/orders');
const collectedOrdersRoutes = require('./routes/collectedOrders');
const cors = require('cors')

// const mongoConnect = require('./utils/database').mongoConnect;

const app = express();

app.use(cors()); // Use this after the variable declaration
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // apllication json

// Avoiding Error for diffrent frontend & backend domains
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Content-Type, Authorization");
  next();
});

app.use(resturantsRoutes);
app.use('/auth', authRoutes);
app.use(menuRoutes);
app.use(ordersRoutes);
app.use(collectedOrdersRoutes);

// mongoConnect(() => {
//   app.listen(8080);
// })


// For Error handler
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect('mongodb+srv://admin:root@cluster0.opqot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(result => {
    app.listen(8080);
    console.log('database connected');
  })
  .catch(err => {
    console.log(err);
    console.log('database connection faild');
  })
