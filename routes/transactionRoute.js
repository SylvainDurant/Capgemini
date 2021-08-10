const express = require('express');
const router = express.Router();
const CurrentAccount = require("../models/currentAccount");
const Transaction = require('../models/transaction');

router.put('/initialCreditTransaction', (req, res) => {
    const {customerID,initialCredit} = req.body;

    // prepare the transaction
    let transaction = Transaction({
        value: initialCredit
    })

    // find the account and make the transaction
    try { CurrentAccount.findOneAndUpdate({"userInformations": customerID}, {
            credit: initialCredit,
            $push: {Transactions: transaction._id}
        }, (error) => {
            if (error) { 
                res.send(error);
            }else{
                // save the transaction
                transaction.save((error) => {
                    if (error) {
                        return res.send(error);
                    }
                })

                res.sendStatus(200);
            }
        }
    )} catch (error) {
        res.send(error);
    }
});

module.exports = router;