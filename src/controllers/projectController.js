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
    const jefeCuadrillaId = req.query.jefeCuadrillaId;

    let proyectos;
    if (jefeCuadrillaId) {
      // Buscar proyectos donde el jefe esté en el array jefesCuadrillaIds
      proyectos = await Project.find({ jefesCuadrillaIds: jefeCuadrillaId });
    } else {
      proyectos = await Project.find();
    }

    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proyectos", error });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proyecto", error });
  }
};
