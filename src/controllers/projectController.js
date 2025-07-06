import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear proyecto", error });
  }
};

export const getProjects = async (req, res) => {
  try {
    const proyectos = await Project.find();
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proyectos" });
  }
};