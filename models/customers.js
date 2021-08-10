let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CustomersSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String }
});

let Customers = mongoose.model("Customers", CustomersSchema);
module.exports = Customers;