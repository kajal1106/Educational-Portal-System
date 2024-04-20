const courseService = require('../services/courseService');

exports.uploadMaterials = async (req, res, next) => {
  try {
    const { moduleId, title, description, filePath } = req.body;
    await courseService.uploadMaterials(moduleId, title, description, filePath);
    res.status(201).json({ message: 'Materials uploaded successfully' });
  } catch (error) {
    console.error('Error uploading materials:', error);
    next(error); // Pass error to error-handling middleware
  }
};

exports.createAssignment = async (req, res, next) => {
  try {
    const { moduleId, title, description, dueDate } = req.body;
    await courseService.createAssignment(moduleId, title, description, dueDate);
    res.status(201).json({ message: 'Assignment created successfully' });
  } catch (error) {
    console.error('Error creating assignment:', error);
    next(error); // Pass error to error-handling middleware
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await courseService.getAllAssignments();
    res.json(assignments);
  } catch (error) {
    res.status(500).send('Error fetching assignments from database');
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    await courseService.deleteAssignment(assignmentId);
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    next(error); // Pass error to error-handling middleware
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    const { title, moduleId, description, dueDate, creationDate } = req.body;
    await courseService.updateAssignment(assignmentId, title, moduleId, description, dueDate, creationDate);
    res.status(200).json({ message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Error updating assignment:', error);
    next(error); // Pass error to error-handling middleware
  }
};

exports.enterLectureNotes = async (req, res, next) => {
  try {
    const { moduleId, topic, content } = req.body;
    await courseService.enterLectureNotes(moduleId, topic, content);
    res.status(201).json({ message: 'Lecture notes entered successfully' });
  } catch (error) {
    console.error('Error entering lecture notes:', error);
    next(error); // Pass error to error-handling middleware
  }
};