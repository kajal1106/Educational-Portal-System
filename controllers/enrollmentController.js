const enrollmentService = require('../services/enrollmentService');

// Controller function to get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    res.json(enrollments);
  } catch (error) {
    res.status(500).send('Error fetching enrollments');
  }
};

// Controller function to get an enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const enrollment = await enrollmentService.getEnrollmentById(id);
    if (!enrollment) {
      res.status(404).send('Enrollment not found');
    } else {
      res.json(enrollment);
    }
  } catch (error) {
    res.status(500).send('Error fetching enrollment');
  }
};

// Controller function to create a new enrollment
exports.createEnrollment = async (req, res) => {
  const { student_id, module_id } = req.body;
  try {
    await enrollmentService.createEnrollment(student_id, module_id);
    res.status(201).send('Enrollment created successfully');
  } catch (error) {
    res.status(500).send('Error creating enrollment');
  }
};

// Controller function to update an enrollment
exports.updateEnrollment = async (req, res) => {
  const { id } = req.params;
  const { student_id, module_id } = req.body;
  try {
    await enrollmentService.updateEnrollment(id, student_id, module_id);
    res.send('Enrollment updated successfully');
  } catch (error) {
    res.status(500).send('Error updating enrollment');
  }
};

// Controller function to delete an enrollment
exports.deleteEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    await enrollmentService.deleteEnrollment(id);
    res.send('Enrollment deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting enrollment');
  }
};
