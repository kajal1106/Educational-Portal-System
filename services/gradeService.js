const db = require('../config/dbConfig');

// Get all grades
exports.getAllGrades = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Grade', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Get a grade by ID
exports.getGradeById = (grade_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Grade WHERE grade_id = ?', [grade_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Create a new grade
exports.createGrade = (grade_name, score_range) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO Grade (grade_name, score_range) VALUES (?, ?)', [grade_name, score_range], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId); // Return the ID of the newly inserted grade
      }
    });
  });
};

// Update a grade
exports.updateGrade = (grade_id, grade_name, score_range) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE Grade SET grade_name = ?, score_range = ? WHERE grade_id = ?', [grade_name, score_range, grade_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Delete a grade
exports.deleteGrade = (grade_id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Grade WHERE grade_id = ?', [grade_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
