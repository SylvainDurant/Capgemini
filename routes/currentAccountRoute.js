const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const CurrentAccount = require("../models/currentAccount");
const Customers = require("../models/customers");
const generateAccountNumber = require('../config/accountNumber');

///// GET REQUESTS /////
router.get('/userInformations/:id', (req, res) => {
    const accountID = req.params.id

    CurrentAccount.findById(accountID).populate("userInformations transactions").exec((error, account) => {
        if (error) { return res.send(error); }

        res.send(account);
    })
});

///// POST REQUESTS /////
router.post('/newCurrentAccount', (req, res) => {
    const {customerID,initialCredit} = req.body;

    // check if the customerID given is valid
    if (customerID.match(/^[0-9a-fA-F]{24}$/)) {
        // find the already existing customer
        try { Customers.findById(customerID).exec((error, customer) => {
            if (error) { return res.send(error); }

            if (!customer) {
                return res.send("There is no existing customer with this id.");
            } else {
                // check if customer already have a account
                CurrentAccount.find({userInformations: customer._id}).then( async (account) => {
                    if (account.length != 0) { 
                        res.send("This customer already has a account: "+ account)
                    } else {
                        // generate account's number
                        let accountNumber = await generateAccountNumber()

                        // asign the customer to an account
                        let new_account = new CurrentAccount({
                            userInformations: customer._id,
                            accountNumber: accountNumber
                        });

                        // save the account in the db
                        new_account.save((error) => {
                            if (error) {
                                return res.send(error);
                            }
                        })

                        // transaction
                        if (initialCredit > 0) {
                            // call the api's endpoint for transactions
                            await axios.put(`http://${req.headers.host}/api/transaction/newTransaction`,{
                                "sender": "initial",
                                "receiver": new_account.accountNumber,
                                "transactionValue": initialCredit 
                            })
                            .then((response) => {
                                if (response.status === 200) {
                                    res.status(200).send(new_account._id);
                                } else {
                                    res.send("Transaction error: " + response.status);
                                }
                            })
                            .catch((error) => {
                                res.send(error);
                            });
                        } else {
                            res.status(200).send(new_account._id);
                        }
                    }
                })
            }
        })} catch (error) {
            res.send(error);
        }
    } else {
        return res.send("This id is not valid.");
    }
});

module.exports = router;