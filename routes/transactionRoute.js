const express = require('express');
const router = express.Router();
const CurrentAccount = require("../models/currentAccount");
const Transaction = require('../models/transaction');

router.put('/newTransaction', (req, res) => {
    const {sender, receiver, transactionValue} = req.body;

    if (transactionValue < 0) {return res.send({error:"Transaction value must be greater than 0"});}

    // check if sufficient funds
    CurrentAccount.findOne({"accountNumber": sender}).then((senderAccount) => {
        if (!senderAccount) {
            return res.send({error:"This account does not exist."})
        } else if (senderAccount.credit < transactionValue) {
            return res.send({error:"insufficient funds"})
        }
    });

    // prepare the transaction
    let transaction = new Transaction({
        value: transactionValue,
        sender: sender, 
        receiver: receiver
    })

    // find receiver transaction
    CurrentAccount.findOne({"accountNumber": receiver}).then( async (receiverAccount) => {
        if (!receiverAccount) {
            return res.send({error:"This account does not exist."})
        } else {
            if (sender != "initial") {
                let valueToSend = transactionValue * -1;

                // make the transaction on the sender account
                await CurrentAccount.findOneAndUpdate({"accountNumber": sender}, {
                    $inc : {'credit' : (valueToSend)},
                    $addToSet: {transactions: transaction._id}
                })
            }

            // make the transaction to the receiver account
            await CurrentAccount.findOneAndUpdate({"accountNumber": receiver}, {
                $inc : {'credit' : transactionValue},
                $addToSet: {transactions: transaction._id}
            })

            // save the transaction
            transaction.save((error) => {
                if (error) {return res.send(error);}
            })

            res.send(transaction);
        }
    })
});

module.exports = router;