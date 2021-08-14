const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const CurrentAccount = require("../models/currentAccount");
const Customers = require("../models/customers");
const generateAccountNumber = require('../config/accountNumber');

///// GET REQUESTS /////
router.get('/accountInformations/:accountNumber', (req, res) => {
    const accountNumber = req.params.accountNumber

    CurrentAccount.findOne({"accountNumber": accountNumber}).populate("userInformations transactions").then((account) => {
        if (!account) {
            return res.send({error:"This account does not exist."});
        } else {
            res.send(account);
        }
    })
});

///// GET REQUESTS /////
router.get('/accountInformations/mongo/:accountNumber', (req, res) => {
    const accountNumber = req.params.accountNumber

    CurrentAccount.findOne({"accountNumber": accountNumber}).populate("userInformations transactions").then((account) => {
        if (!account) {
            return res.send({error:"This account does not exist."});
        } else {
            res.send(account);
        }
    })
});

///// POST REQUESTS /////
router.post('/newCurrentAccount', (req, res) => {
    const {customerID,initialCredit} = req.body;

    // find the already existing customer
    try { Customers.findById(customerID).exec((error, customer) => {
        if (error) { return res.send(error); }

        if (!customer) {
            return res.send({error:"There is no existing customer with this id."});
        } else {

            // generate account's number
            let accountNumber = await generateAccountNumber()

            // asign the customer to an account
            let new_account = new CurrentAccount({
                userInformations: customer._id,
                accountNumber: accountNumber
            });

            // transaction
            if (initialCredit > 0) {
                // call the api's endpoint for transactions
                await axios.put(`http://${req.headers.host}/api/transaction/newTransaction`,{
                    "sender": "initial",
                    "receiver": new_account.accountNumber,
                    "transactionValue": initialCredit 
                })
                .then((response) => {
                    if (response.error) {
                        res.send({error: response.error});
                    } else {
                        //add transaction to array of transactions
                        new_account.transactions.push(transaction._id)
                        res.send(new_account);
                    }
                })
                .catch((error) => {
                    res.send(error);
                });
            } else {
                res.send(new_account);
            }

        }
    })} catch (error) {
        res.send(error);
    }
});

module.exports = router;