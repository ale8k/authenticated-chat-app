let mongy = require("mongoose");
let Schema = mongy.Schema;

let userSchema = new Schema({
    email: String,
    username: String,
    password: String
});

let User = mongy.model("users", userSchema);
module.exports = User;