let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let TransactionSchema = new Schema({
  value: Number,
  sender: String,
  receiver: String,
  create_at: {
    type: Date,
    default: Date.now
  }
});

let Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;