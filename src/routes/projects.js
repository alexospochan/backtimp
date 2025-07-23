import express from "express";
import { createProject, getProjects, getProjectById } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);  // acepta query ?jefeCuadrillaId=...
router.get("/:id", getProjectById);

export default router;
