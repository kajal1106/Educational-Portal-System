const db = require('../config/dbConfig');

exports.assignGrade = (lecturer_id, student_id, module_id, score) => {
  return new Promise((resolve, reject) => {
    db.query('CALL AssignGrade(?, ?, ?, ?)', [lecturer_id, student_id, module_id, score], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};


exports.getTopPerformingStudents = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM TopPerformingStudentsView', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


exports.getAllGradeAssignments = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM GradeAssignment', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.getGradeAssignmentById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM GradeAssignment WHERE grade_assignment_id = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

exports.createGradeAssignment = (lecturer_id, student_id, module_id, grade_id, score) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO GradeAssignment (lecturer_id, student_id, module_id, grade_id, score) VALUES (?, ?, ?, ?, ?)', 
      [lecturer_id, student_id, module_id, grade_id, score], 
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

exports.updateGradeAssignment = (id, lecturer_id, student_id, module_id, grade_id, score) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE GradeAssignment SET lecturer_id = ?, student_id = ?, module_id = ?, grade_id = ?, score = ? WHERE grade_assignment_id = ?', 
      [lecturer_id, student_id, module_id, grade_id, score, id], 
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

exports.deleteGradeAssignment = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM GradeAssignment WHERE grade_assignment_id = ?', [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};