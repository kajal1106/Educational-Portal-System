// controllers/moduleController.js

const moduleService = require('../services/moduleService');

exports.getAllModules = async (req, res) => {
  try {
    const modules = await moduleService.getAllModules();
    res.json(modules);
  } catch (error) {
    res.status(500).send('Error fetching modules from database');
  }
};

exports.getModuleById = async (req, res) => {
  const { id } = req.params;
  try {
    const module = await moduleService.getModuleById(id);
    if (!module) {
      res.status(404).send('Module not found');
    } else {
      res.json(module);
    }
  } catch (error) {
    res.status(500).send('Error fetching module from database');
  }
};

exports.createModule = async (req, res) => {
  const { module_name } = req.body;
  try {
    await moduleService.createModule(module_name);
    res.status(201).send('Module created successfully');
  } catch (error) {
    res.status(500).send('Error creating module');
  }
};

exports.updateModule = async (req, res) => {
  const { id } = req.params;
  const { module_name } = req.body;
  try {
    await moduleService.updateModule(id, module_name);
    res.send('Module updated successfully');
  } catch (error) {
    res.status(500).send('Error updating module');
  }
};

exports.deleteModule = async (req, res) => {
  const { id } = req.params;
  try {
    await moduleService.deleteModule(id);
    res.send('Module deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting module');
  }
};
