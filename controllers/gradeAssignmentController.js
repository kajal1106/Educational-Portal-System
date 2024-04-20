const gradeAssignmentService = require('../services/gradeAssignmentService');

// Function to invoke the stored procedure for assigning grades
exports.assignGrade = async (req, res) => {
  const { lecturer_id, student_id, module_id, score } = req.body;
  try {
    const result = await gradeAssignmentService.assignGrade(lecturer_id, student_id, module_id, score);
    res.json({ message: 'Grade assigned successfully', data: result });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};



exports.getAllGradeAssignments = async (req, res) => {
  try {
    const gradeAssignments = await gradeAssignmentService.getAllGradeAssignments();
    res.json(gradeAssignments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getGradeAssignmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const gradeAssignment = await gradeAssignmentService.getGradeAssignmentById(id);
    if (!gradeAssignment) {
      return res.status(404).json({ error: 'Grade Assignment not found' });
    }
    res.json(gradeAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createGradeAssignment = async (req, res) => {
  const { lecturer_id, student_id, module_id, grade_id, score } = req.body;
  try {
    await gradeAssignmentService.createGradeAssignment(lecturer_id, student_id, module_id, grade_id, score);
    res.status(201).send('Grade Assignment created successfully');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateGradeAssignment = async (req, res) => {
  const { id } = req.params;
  const { lecturer_id, student_id, module_id, grade_id, score } = req.body;
  try {
    await gradeAssignmentService.updateGradeAssignment(id, lecturer_id, student_id, module_id, grade_id, score);
    res.send('Grade Assignment updated successfully');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteGradeAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    await gradeAssignmentService.deleteGradeAssignment(id);
    res.send('Grade Assignment deleted successfully');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
