let express = require("express");
let router = express.Router();
let User = require("../models/user-schema");

/**
 * Login?
 */
router.get("/", (req, res) => {

    ({ username, email, password } = req.body);


    User.find({ username: username, email: email, password: password}, 
        (err, user) => {
            if (user.length > 0) {

            }
    })
});

/**
 * Create a user
 * JOI coming in soon...
 */
router.post("/create-account", (req, res) => {
    // Middleware this.
    User.find({ username: req.body.username }, (err, user) => {
        if (user.length > 0) {
            res.send("User already exists");
        } else {

            let newUser = User({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            });

            newUser.save( (err) => {
                if (err) throw err;
                console.log("User created");
                console.log("Username/email: " + req.body.email);
                console.log("Password: " + req.body.password);
            })

            res.send("Created user successfully!")
        }
    });
});

/**
 * Delete all users: debugging purposes
 */
router.delete("/", (req, res) => {
    User.deleteMany({}, () => {});
    res.send(200);
});

module.exports = router;