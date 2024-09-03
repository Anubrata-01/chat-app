import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const maxTime = 3 * 24 * 60 * 60 * 1000; 
const createToken = (email, userId) => jwt.sign(
    { email, userId },
    process.env.JWT_KEY, 
    { expiresIn: maxTime } 
);
const cookieOptions = {
   
    secure: true,
    maxAge: maxTime,
    sameSite: 'None',
  };
  

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required!");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("This email address is already present in the database");
            return res.status(409).json({
                message: "Email address is already present!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        const token = createToken(user.email, user._id);

        res.cookie('jwt', token, cookieOptions); 

        return res.status(201).json({
            message: "User created successfully",
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found!");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid password!");
        }

        const token = createToken(user.email, user._id);

        res.cookie('jwt', token, cookieOptions); 

        return res.status(200).json({
            message: "Sign in successful",
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

export const getUserInfo = async (req, res) => {
    try {
        const user = req.user; 

        if (!user) {
            return res.status(404).send("User not found!");
        }

        return res.status(200).json({
            message: "User information retrieved successfully",
            user: { _id: user._id, email: user.email, profileSetup: user.profileSetup,firstname:user.firstname,lastname:user.lastname,image:user.image,color:user.color }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const saveUserDetails = async (req, res) => {
    try {
      const { _id } = req.user;
      const { firstname, lastname, color } = req.body;
  
      if (!firstname || !lastname) {
        return res.status(400).send("These fields are required");
      }
  
      const user = await User.findByIdAndUpdate(
        _id,
        {
          firstname,
          lastname,
          color,
          profileSetup: true,
        },
        { new: true }
      );
  
      return res.status(200).json({
        message: "User information updated successfully",
        user: {
          _id: user._id,
          email: user.email,
          profileSetup: user.profileSetup,
          firstname: user.firstname,
          lastname: user.lastname,
          image: user.image,
          color: user.color,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
  

export const uploadProfileImage=async (req, res) => {
    try {
      // req.file contains the uploaded file info
      // req.body contains the text fields
  
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, 
        {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          color: req.body.color,
          image: req.file ? `/uploads/${req.file.filename}` : undefined
        },
        { new: true }
      );
  
      res.json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  };
  
