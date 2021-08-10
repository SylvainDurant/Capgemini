const express = require('express');
const router = express.Router();

router.put('/newTransaction', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});

module.exports = router;