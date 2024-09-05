
import { Router } from "express";
import { getUserInfo, refreshAccessToken, saveUserDetails, signin, signup, uploadProfileImage } from "../controllers/AuthController.js";
import authenticate from "../AuthMiddleware/index.js";
import multer from "multer";
import { upload } from "../AuthMiddleware/uploadMiddleware.js";
const router=Router();
router.post("/signup",signup)
router.post("/signin",signin)
router.get("/getuserinfo",authenticate,getUserInfo);
router.post("/updateuser-info",authenticate,saveUserDetails);
router.post("/refresh-token",refreshAccessToken)
router.post('/upload-profile-image',authenticate, uploadProfileImage);
// router.post('/upload-profile-image',authenticate, upload.single('image'), uploadProfileImage);

export default router;