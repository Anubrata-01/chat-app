
import { Router } from "express";
import { getUserInfo, signin, signup } from "../controllers/AuthController.js";
import authenticate from "../AuthMiddleware/index.js";
const router=Router();

router.post("/signup",signup)
router.post("/signin",signin)
router.get("/getuserinfo",authenticate,getUserInfo)
export default router;