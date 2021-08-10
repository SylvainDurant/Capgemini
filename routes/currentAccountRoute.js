const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const CurrentAccount = require("../models/currentAccount");
const Customers = require("../models/customers");

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
                        // asign the customer to an account
                        let new_account = new CurrentAccount({
                            userInformations: customer._id
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
                                "accountID": new_account._id,
                                "transactionValue": initialCredit 
                            })
                                .then((response) => {
                                    if (response.status === 200) {
                                        res.sendStatus(200);
                                    } else {
                                        res.send("Transaction error: " + response.status);
                                    }
                                })
                                .catch((error) => {
                                    res.send(error);
                            });
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