import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";// token validation
import multer from "multer";
import { addProject, getProjectById, getProjects } from "../controller/projectController.js";


const upload = multer({ dest: "uploads/" });



const projectRouter = express.Router();
// Routes
projectRouter.post("/", authMiddleware, upload.array("images"), addProject); // only logged-in users
projectRouter.get("/", getProjects); // pagination with offset & limit
projectRouter.get("/:id", getProjectById);


export default projectRouter;