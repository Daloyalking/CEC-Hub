// routes/excoRoute.js
import express from "express";
import multer from "multer";
import { getExcos, addExco, deleteExco } from "../controller/excoController.js";

const excoRouter = express.Router();
const upload = multer({ dest: "uploads/" });

excoRouter.get("/", getExcos);
excoRouter.post("/", upload.single("photo"), addExco);
excoRouter.delete("/:id", deleteExco);

export default excoRouter;