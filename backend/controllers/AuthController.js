import User from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path"
import mongoose from 'mongoose';
import MessageModel from "../models/MessagesModel.js";
const maxAccessTokenTime = 15 * 60;
const maxRefreshTokenTime = 7 * 24 * 60 * 60; 
 const createAccessToken = (email, userId) => {
  try {
    return jwt.sign(
      { email, userId },
      process.env.JWT_KEY,
      { expiresIn: '15m' }
    );
  } catch (error) {
    console.error('Error creating access token:', error);
    throw new Error('Token creation failed');
  }
};

 const createRefreshToken = (email, userId) => {
  try {
    return jwt.sign(
      { email, userId },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: '7d' }
    );
  } catch (error) {
    console.error('Error creating refresh token:', error);
    throw new Error('Token creation failed');
  }
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ email, password: hashedPassword });
    await user.save();
    console.log("Original password:", password);
    console.log("Hashed password:", hashedPassword)
    const accessToken = createAccessToken(user.email, user._id);
    const refreshToken = createRefreshToken(user.email, user._id);
    res.cookie('jwt', accessToken, {
      secure: true,
      sameSite: 'None',
      maxAge: maxAccessTokenTime * 1000,  // 15-minute expiration
    });

    res.cookie('refreshToken', refreshToken, {
      secure: true,
      sameSite: 'None',
      maxAge: maxRefreshTokenTime * 1000,  // 7-day expiration
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
        password:user.password,
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
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }


    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', user.email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const accessToken = createAccessToken(user.email, user._id);
    const refreshToken = createRefreshToken(user.email, user._id);
    res.cookie('jwt', accessToken, {
      secure: true,
     
      sameSite: 'None',
      maxAge: maxAccessTokenTime * 1000,  
    });

    res.cookie('refreshToken', refreshToken, {
      secure: true,
      
      sameSite: 'None',
      maxAge: maxRefreshTokenTime * 1000,  
    });

    res.status(200).json({ message: 'Login successful', accessToken, refreshToken });

  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      console.error('No refresh token provided');
      return res.status(403).json({ error: 'Access denied. No refresh token provided.' });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch (err) {
      console.error('Invalid refresh token:', err);
      return res.status(403).json({ error: 'Invalid refresh token.' });
    }

    // Check if the user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error('User not found for refresh token:', decoded.userId);
      return res.status(403).json({ error: 'User not found.' });
    }


    // Generate a new access token
    const newAccessToken = createAccessToken(user.email, user._id);

    // Set the new JWT access token in cookies
    res.cookie('jwt', newAccessToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      maxAge: maxAccessTokenTime * 1000,  // 15-minute expiration
    });

    return res.status(200).json({ message: 'New access token generated.' });

  } catch (error) {
    console.error('Error during token refresh:', error);
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

export const getAllUsers=async(req,res)=>{
  try{
    const users=await User.find();
    if(!users){
      res.status(404).send("users are not found!")
    }
    return res.status(200).json(users)

  }catch(error){
    console.log("problem in fetch allusers from database",error)
  }
}

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
      cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${req.user._id}${path.extname(file.originalname)}`)}
  });
  
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }).single('image');
  
  export const uploadProfileImage = async (req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        
        return res.status(500).json({ error: 'An error occurred while uploading the file.' });
      }
      
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
  
      res.status(200).json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}` // This is the path where the image can be accessed
      });
    });
  };
  


  export const logout = async (req, res, next) => {
    try {
      res.clearCookie('jwt', { path: '/', secure: true, sameSite: 'None' });
      res.clearCookie('refreshToken', { path: '/', secure: true, sameSite: 'None' });
      return res.status(200).send("Logout successful");
    } catch (error) {
      console.error({ error });
      return res.status(500).send("Internal server error");
    }
  };
  


  // serachcontacts route

  export const searchContacts = async (req, res, next) => {
    try {
      const { searchText } = req.body;

      if (searchText === undefined || searchText === null || searchText.trim() === '') {
        return res.status(400).json({ message: "Search text is required!" });
      }
  
      const contacts = await User.find({
        $and: [
          { _id: { $ne: req.userId } },  // Exclude the current user
          { $or: [ 
              { firstname: { $regex: searchText, $options: 'i' } },  
              {lastname:{$regex: searchText, $options: 'i' }},
              { email: { $regex: searchText, $options: 'i' } }      
            ]
          }
        ]
      });
  
      return res.status(200).json({
        message: "Contacts searched successfully",
        contacts
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error in searchContacts" });
    }
  };
  


 // Fetch messages between two users
// export const getMessages = async (req, res) => {
//   const { senderId, recipientId } = req.query;

//   if (!senderId || !recipientId) {
//     return res.status(400).json({ message: 'Missing senderId or recipientId' });
//   }

//   try {
//     const messages = await MessageModel.find({
//       senderId,
//       recipientId
//     });

//    return  res.status(200).json(messages);
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     res.status(500).json({ message: 'Error fetching messages' });
//   }
// };


export const getMessages = async (req, res) => {
  const { senderId, recipientId } = req.query;

  if (!senderId || !recipientId) {
    return res.status(400).json({ message: 'Missing senderId or recipientId' });
  }

  try {
    const messages = await MessageModel.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};




// Send a new message
export const sendMessage = async (req, res) => {
  const { senderId, content, recipientId, messageType, fileUrl, timestamp } = req.body;
  try {
    const newMessage = await MessageModel.create({
      senderId,
      recipientId,
      content,
      messageType,
      fileUrl,
      timestamp,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error); // Log the error
    res.status(500).json({ error: 'Error sending message' });
  }
};

