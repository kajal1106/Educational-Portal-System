const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const moduleController = require('../controllers/moduleController');
const lecturerController = require('../controllers/lecturerController');
const gradeController = require('../controllers/gradeController');
const enrollmentController = require('../controllers/enrollmentController');
const teachingController = require('../controllers/teachingController');
const gradeAssignmentController = require('../controllers/gradeAssignmentController');
const userController = require('../controllers/userController');
const auditLogController = require('../controllers/auditLogController');
const topPerformingController = require('../controllers/topPerformingStudentsController');
const courseController = require('../controllers/courseController');

// Student routes
router.get('/students', studentController.getAllStudents);
router.get('/students/:id', studentController.getStudentById);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

// Module routes
router.get('/modules', moduleController.getAllModules);
router.get('/modules/:id', moduleController.getModuleById);
router.post('/modules', moduleController.createModule);
router.put('/modules/:id', moduleController.updateModule);
router.delete('/modules/:id', moduleController.deleteModule);

// Lecturer routes
router.get('/lecturers', lecturerController.getAllLecturers);
router.get('/lecturers/:id', lecturerController.getLecturerById);
router.post('/lecturers', lecturerController.createLecturer);
router.put('/lecturers/:id', lecturerController.updateLecturer);
router.delete('/lecturers/:id', lecturerController.deleteLecturer);

// Grade routes
router.get('/grades', gradeController.getAllGrades);
router.get('/grades/:id', gradeController.getGradeById);
router.post('/grades', gradeController.createGrade);
router.put('/grades/:id', gradeController.updateGrade);
router.delete('/grades/:id', gradeController.deleteGrade);

// Enrollment routes
router.get('/enrollments', enrollmentController.getAllEnrollments);
router.get('/enrollments/:id', enrollmentController.getEnrollmentById);
router.post('/enrollments', enrollmentController.createEnrollment);
router.put('/enrollments/:id', enrollmentController.updateEnrollment);
router.delete('/enrollments/:id', enrollmentController.deleteEnrollment);

// Teaching routes
router.get('/teachings', teachingController.getAllTeachings);
router.get('/teachings/:id', teachingController.getTeachingById);
router.post('/teachings', teachingController.createTeaching);
router.put('/teachings/:id', teachingController.updateTeaching);
router.delete('/teachings/:id', teachingController.deleteTeaching);

// GradeAssignment routes
router.get('/gradeAssignments', gradeAssignmentController.getAllGradeAssignments);
router.get('/gradeAssignments/:id', gradeAssignmentController.getGradeAssignmentById);
router.post('/gradeAssignments', gradeAssignmentController.createGradeAssignment);
router.put('/gradeAssignments/:id', gradeAssignmentController.updateGradeAssignment);
router.delete('/gradeAssignments/:id', gradeAssignmentController.deleteGradeAssignment);

// Endpoint for assigning a grade via the stored procedure
router.post('/assign-grade', gradeAssignmentController.assignGrade);

// Top-performing students route
router.get('/top-performing-students', topPerformingController.getTopPerformingStudents);

// Users routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Audit logs route
router.get('/audit-logs', auditLogController.getAllAuditLogs);
router.get('/audit-logs/:id', auditLogController.getAuditLogById);
router.post('/audit-logs', auditLogController.createAuditLog);
router.delete('/audit-logs/:id', auditLogController.deleteAuditLog);

// Course routes
router.post('/upload-materials', courseController.uploadMaterials);
router.post('/create-assignment', courseController.createAssignment);
router.post('/enter-lecture-notes', courseController.enterLectureNotes);
router.get('/assignments', courseController.getAllAssignments);
// Route for deleting an assignment
router.delete('/assignments/:id', courseController.deleteAssignment);
// Route for updating an assignment
router.put('/assignments/:id', courseController.updateAssignment);


module.exports = router;
