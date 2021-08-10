const express = require('express');
const router = express.Router();
const CurrentAccount = require("../models/currentAccount");

router.put('/newTransaction', (req, res) => {
    const {customerID,initialCredit} = req.body;

    // find the account and make the transaction
    try { CurrentAccount.findOneAndUpdate({"userInformations": customerID}, {
            credit: initialCredit,
        }, (error) => {
            if (error) { 
                res.send(error);
            }else{
                res.sendStatus(200);
            }
        }
    )} catch (error) {
        res.send(error);
    }
});

module.exports = router;