const studentService = require('../services/studentService');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).send('Error fetching students from database');
  }
};

exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentService.getStudentById(id);
    if (!student) {
      res.status(404).send('Student not found');
    } else {
      res.json(student);
    }
  } catch (error) {
    res.status(500).send('Error fetching student from database');
  }
};

exports.createStudent = async (req, res) => {
  const { name, email } = req.body;
  try {
    await studentService.createStudent(name, email);
    res.status(201).send('Student created successfully');
  } catch (error) {
    res.status(500).send('Error creating student');
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await studentService.updateStudent(id, name, email);
    res.send('Student updated successfully');
  } catch (error) {
    res.status(500).send('Error updating student');
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await studentService.deleteStudent(id);
    res.send('Student deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting student');
  }
};
