let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let TransactionSchema = new Schema({
  value: Number,
  create_at: {
    type: Date,
    default: Date.now
  }
});

let Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;