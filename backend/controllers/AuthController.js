import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const maxTime = 3 * 24 * 60 * 60; 
const createToken = (email, userId) => jwt.sign(
    { email, userId },
    process.env.JWT_KEY, 
    { expiresIn: maxTime } 
);

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required!");
        }
        const existingUser=await User.findOne({email,password});
        if(existingUser){
            console.log("This email address is already present in the database");
            return res.status(500).json({
                message:"Email address is already present!"
            })
        }
        const user = await User.create({ email, password });

        const token = createToken(user.email, user._id);

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const signin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send("Email and Password are required!");
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("User not found!");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Invalid password!");
      }
      const token = createToken(user.email, user._id);
      return res.status(200).json({
        message: "Sign in successful",
        token,
        user: {
          _id: user._id,
          email: user.email,
          profileSetup: user.profileSetup
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  };