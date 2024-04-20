const topPerformingStudentsService = require('../services/topPerformingStudentsService');

exports.getTopPerformingStudents = async (req, res) => {
  try {
    const topPerformingStudents = await topPerformingStudentsService.getTopPerformingStudents();
    res.json(topPerformingStudents);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
