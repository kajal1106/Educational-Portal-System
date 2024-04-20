const db = require('../config/dbConfig');

// Function to get all enrollments
exports.getAllEnrollments = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Enrollment', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to get an enrollment by ID
exports.getEnrollmentById = (enrollment_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Enrollment WHERE enrollment_id = ?', [enrollment_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Function to create a new enrollment
exports.createEnrollment = (student_id, module_id) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO Enrollment (student_id, module_id) VALUES (?, ?)', [student_id, module_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Function to update an enrollment
exports.updateEnrollment = (enrollment_id, student_id, module_id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE Enrollment SET student_id = ?, module_id = ? WHERE enrollment_id = ?', [student_id, module_id, enrollment_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Function to delete an enrollment
exports.deleteEnrollment = (enrollment_id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Enrollment WHERE enrollment_id = ?', [enrollment_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};