let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CurrentAccountSchema = new Schema({
    userInformations: {
        type: Schema.Types.ObjectId,
        ref: "Customers"
    },
    credit: { 
        type: Number,
        default: 0
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: "Transaction",
        default: []
    }],
    accountNumber: {
        type: String,
        unique: true
    }
});

let CurrentAccount = mongoose.model("CurrentAccount", CurrentAccountSchema);
module.exports = CurrentAccount;