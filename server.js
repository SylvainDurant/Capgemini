require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const currentAccountRoute = require('./routes/currentAccountRoute');
const transactionRoute = require('./routes/transactionRoute');
  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

///// Mongoose /////
require('./config/db')();

///// Routes /////
app.use('/api/currentAccount', currentAccountRoute)
app.use('/api/transaction', transactionRoute)

app.listen(port, () => console.log(`Server running on ${port}`));

///// Middleware /////
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});