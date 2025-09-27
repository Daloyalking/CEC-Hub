import express from "express";
import { changePassword, editProfile, getAllUsers, getUserById, login, requestPasswordReset, resetPassword, signUp } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.get("/alluser", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/edit", authMiddleware, editProfile);
userRouter.put("/change-password", authMiddleware, changePassword);
userRouter.post("/password-reset-request", requestPasswordReset);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;
