import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  changePassword,
  editProfile,
  getAllUsers,
  getUserById,
  login,
  requestPasswordReset,
  resetPassword,
  signUp,
} from "../controller/userController.js";

const userRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Routes
userRouter.post("/signup", upload.single("picture"), signUp);
userRouter.post("/login", login);
userRouter.get("/alluser", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/edit", authMiddleware, upload.single("picture"), editProfile);
userRouter.put("/change-password", authMiddleware, changePassword);
userRouter.post("/password-reset-request", requestPasswordReset);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;
