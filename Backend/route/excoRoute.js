import express from "express";
import multer from "multer";
import { getExcos, addExco, deleteExco } from "../controller/excoController.js";

const excoRouter = express.Router();

// ✅ Use memory storage (no local disk)
const upload = multer({ storage: multer.memoryStorage() });

excoRouter.get("/", getExcos);
excoRouter.post("/", upload.single("photo"), addExco);
excoRouter.delete("/:id", deleteExco);

export default excoRouter;
