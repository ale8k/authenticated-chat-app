import mongoose from "mongoose";
import { compareSync, hashSync, genSaltSync } from "bcryptjs";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        validate: {
            validator: username => User.doesNotExist({ username }),
            message: "Username already exists"
        }
    },
    email: {
        type: String,
        validate: {
            validator: email => User.doesNotExist({ email }),
            message: "Email already exists"
        }
    },
    password: {
        type: String,
        required: true
    }
}, 
{ 
    timestamps: true 
});

/**
 * Let's take these methods out of here
 * and perhaps have them in another folder... 
 * Needs abit of work.
 */

// PRE middle ware hook
// If the password is saved & modified, hash and salt it again.
// Just ensures our PW is always hashed.
UserSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = hashSync(this.password, 10);
    }
});

// Static method to ensure user exists, if returns true
// Validation will fail in our schema above.
UserSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
};

// Our compare method validator for the hash
UserSchema.methods.comparePasswords = function (password) {
    return compareSync(password, this.password);
};

const User = mongoose.model("users", UserSchema);

export default User;