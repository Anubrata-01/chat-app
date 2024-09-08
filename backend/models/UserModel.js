import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true,"Password is required"]
    },
    firstname: {
        type: String,
        
    },
    lastname: {
        type: String,
        
    },
    color: {
        type: String,
        default: "#ffffff", 
    },
    image: {
        type: String, 
    },
    profileSetup: {
        type: Boolean,
        default: false, 
    },
});


// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next();
//     }

//     try {
//         const salt = await bcrypt.genSalt(10); // Generate salt
//         this.password = await bcrypt.hash(this.password, salt); // Hash the password
//         next();
//     } catch (error) {
//         next(error);
//     }
// });
const User = mongoose.model('Users', UserSchema);

export default User;
