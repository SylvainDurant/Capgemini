const express = require('express');
const router = express.Router();
const CurrentAccount = require("../models/currentAccount");
const Transaction = require('../models/transaction');

router.put('/newTransaction', (req, res) => {
    const {sender, receiver, transactionValue} = req.body;
    console.log(req.body);
    console.log(sender, receiver, transactionValue);

    if (!sender) { return res.send({error:"Provide a valid account number for sender."}); }
    if (!receiver) { return res.send({error:"Provide a valid account number for receiver."}); }
    if (!transactionValue || typeof transactionValue != "number" || (transactionValue < 0)) { 
        return res.send({error:"Transaction value must be an integer greater than 0"}); 
    }
    if (sender == receiver) { return res.send({error:"Sender and receiver cannot be the same account."}); }

    const makeTransaction = () => {
        // prepare the transaction
        let transaction = new Transaction({
            value: transactionValue,
            sender: sender, 
            receiver: receiver
        })

        // find receiver transaction
        CurrentAccount.findOne({"accountNumber": receiver}).then( async (receiverAccount) => {
            if (!receiverAccount) {
                return res.send({error:"Receiver account does not exist."})
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
                transaction.save();

                res.send(transaction);
            }
        })
    }
    
    // check if sufficient funds
    if (sender != "initial"){
        CurrentAccount.findOne({"accountNumber": sender}).then((senderAccount) => {
            if (!senderAccount) {
                return res.send({error:"Sender account does not exist."})
            } else if (senderAccount.credit < transactionValue) {
                return res.send({error:"insufficient funds"})
            } else {
                makeTransaction();
            }
        });
    } else {
        makeTransaction();
    }
});

module.exports = router;