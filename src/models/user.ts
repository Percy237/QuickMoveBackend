import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
     role: "customer" | "mover" | "admin";
}

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    address: {type: String, required: true},
    role: { 
        type: String, 
        required: true, 
        enum: ["customer", "mover", "admin"], 
        default: "customer" 
    },

})

userSchema.pre("save", async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
})

const User = mongoose.model<UserType>("User", userSchema);

export default User;