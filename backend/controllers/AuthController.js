import User from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path"
const maxAccessTokenTime = 15 * 60;
const maxRefreshTokenTime = 7 * 24 * 60 * 60; 
const createAccessToken = (email, userId) => jwt.sign(
  { email, userId },
  process.env.JWT_KEY,
  { expiresIn: maxAccessTokenTime } 
);

const createRefreshToken = (email, userId) => jwt.sign(
  { email, userId },
  process.env.REFRESH_TOKEN_KEY,  
  { expiresIn: maxRefreshTokenTime }  
);
const cookieOptions = {
   
  secure: true,
  sameSite: 'None',
};
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and Password are required!");
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email address is already present!"
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    // Create access and refresh tokens
    const accessToken = createAccessToken(user.email, user._id);
    const refreshToken = createRefreshToken(user.email, user._id);

    // Set cookies for access and refresh tokens
    res.cookie('jwt', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      maxAge: maxAccessTokenTime * 1000,  // 15-minute expiration
    });

    res.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      maxAge: maxRefreshTokenTime * 1000,  // 7-day expiration
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found!");
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid password!");
    }

    // Create access and refresh tokens
    const accessToken = createAccessToken(user.email, user._id);
    const refreshToken = createRefreshToken(user.email, user._id);

    // Set cookies for tokens
    res.cookie('jwt', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      maxAge: maxAccessTokenTime * 1000,  // Access token
    });

    res.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      maxAge: maxRefreshTokenTime * 1000,  // Refresh token
    });

    return res.status(200).json({
      message: "Sign in successful",
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};



export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;  
    if (!refreshToken) {
      return res.status(403).json({ error: 'Access denied. No refresh token provided.' });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

    if (!decoded) {
      return res.status(403).json({ error: 'Invalid refresh token.' });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ error: 'User not found.' });
    }
    const newAccessToken = createAccessToken(user.email, user._id);

    // Send the new access token in cookies
    res.cookie('jwt', newAccessToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      maxAge: maxAccessTokenTime * 1000,  
    });

    return res.status(200).json({ message: 'New access token generated.' });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
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
      const { firstname, lastname, color,image } = req.body;
  
      if (!firstname || !lastname) {
        return res.status(400).send("These fields are required");
      }
  
      const user = await User.findByIdAndUpdate(
        _id,
        {
          firstname,
          lastname,
          color,
          image,
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
  


  
  // Configure multer for file upload
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${req.user._id}${path.extname(file.originalname)}`) // Appending timestamp and user ID to ensure uniqueness
    }
  });
  
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
      // Accept images only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }).single('image'); // 'image' is the field name in the form data
  
  export const uploadProfileImage = async (req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).json({ error: 'An error occurred while uploading the file.' });
      }
      
      // Everything went fine.
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
  
      // File uploaded successfully, you might want to save the file info to the user's profile in your database
      // For example:
      // req.user.profileImage = `/uploads/${req.file.filename}`;
      // await req.user.save();
  
      res.status(200).json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}` // This is the path where the image can be accessed
      });
    });
  };
  
