require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

///// Mongoose /////
require('./config/db')();

///// Routes /////
app.use('/api/', Routes)

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

///// Middleware /////
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});