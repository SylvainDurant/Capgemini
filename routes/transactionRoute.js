const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

router.put('/newTransaction', (req, res) => {
    const {sender, receiver, transactionValue} = req.body;

    if (transactionValue < 0) {return res.send({error:"Transaction value must be greater than 0"});}

    // prepare the transaction
    let transaction = new Transaction({
        value: transactionValue,
        sender: sender,
        receiver: receiver
    })

    // save the transaction
    transaction.save((error) => {
        if (error) {return res.send(error);}
    })

    // send back the transaction
    res.send(transaction);
});

module.exports = router;