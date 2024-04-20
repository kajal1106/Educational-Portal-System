const db = require('../config/dbConfig');

exports.getAllStudents = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Student', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.getStudentById = (student_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Student WHERE student_id = ?', [student_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

exports.createStudent = (name, email) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO Student (name, email) VALUES (?, ?)', [name, email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.updateStudent = (student_id, name, email) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE Student SET name = ?, email = ? WHERE student_id = ?', [name, email, student_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.deleteStudent = (student_id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Student WHERE student_id = ?', [student_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
