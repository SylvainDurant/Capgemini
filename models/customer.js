let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CustomerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String }
});

let Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;