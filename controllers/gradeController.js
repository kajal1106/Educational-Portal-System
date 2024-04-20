const gradeService = require('../services/gradeService');

// Get all grades
exports.getAllGrades = async (req, res) => {
  try {
    const grades = await gradeService.getAllGrades();
    res.json(grades);
  } catch (error) {
    res.status(500).send('Error fetching grades from database');
  }
};

// Get grade by ID
exports.getGradeById = async (req, res) => {
  const { id } = req.params;
  try {
    const grade = await gradeService.getGradeById(id);
    if (!grade) {
      res.status(404).send('Grade not found');
    } else {
      res.json(grade);
    }
  } catch (error) {
    res.status(500).send('Error fetching grade from database');
  }
};

// Create a new grade
exports.createGrade = async (req, res) => {
  const { grade_name, score_range } = req.body;
  try {
    const newGradeId = await gradeService.createGrade(grade_name, score_range);
    res.status(201).json({ id: newGradeId, message: 'Grade created successfully' });
  } catch (error) {
    res.status(500).send('Error creating grade');
  }
};

// Update a grade
exports.updateGrade = async (req, res) => {
  const { id } = req.params;
  const { grade_name, score_range } = req.body;
  try {
    await gradeService.updateGrade(id, grade_name, score_range);
    res.send('Grade updated successfully');
  } catch (error) {
    res.status(500).send('Error updating grade');
  }
};

// Delete a grade
exports.deleteGrade = async (req, res) => {
  const { id } = req.params;
  try {
    await gradeService.deleteGrade(id);
    res.send('Grade deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting grade');
  }
};
