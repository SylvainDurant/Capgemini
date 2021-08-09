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
    }
});

let CurrentAccount = mongoose.model("CurrentAccount", CurrentAccountSchema);
module.exports = CurrentAccount;