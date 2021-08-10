let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CurrentAccountSchema = new Schema({
    userInformations: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    credit: { 
        type: Number,
        default: 0
    },
    Transactions: [{
        type: Schema.Types.ObjectId,
        ref: "Transaction",
        default: []
    }]
});

let CurrentAccount = mongoose.model("CurrentAccount", CurrentAccountSchema);
module.exports = CurrentAccount;