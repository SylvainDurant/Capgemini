const express = require('express');
const router = express.Router();
const CurrentAccount = require("../models/currentAccount");
const Customers = require("../models/customers");

router.post('/newCurrentAccount', (req, res) => {
    const {customerID,initialCredit} = req.body;

    // check if the customerID given is valid
    if (customerID.match(/^[0-9a-fA-F]{24}$/)) {
        // find the already existing customer
        try { Customers.findById(customerID).then((customer) => {
            if (!customer) {
                return res.send("There is no existing customer with this id.");
            } else {
                // asign the customer to an account
                let new_account = new CurrentAccount({
                    userInformations: customer._id
                });

                new_account.save((error) => {
                    if (error) {
                        return res.send(error);
                    }

                    res.sendStatus(200);
                })
            }
        })} catch (error) {
            console.log(error);
        }
    } else {
        return res.send("This id is not valid.");
    }
});

module.exports = router;