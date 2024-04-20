const db = require('../config/dbConfig');

// Get all lecturers
exports.getAllLecturers = async () => {
  return new Promise((resolve, reject) => {
      const query = `
          SELECT 
              l.lecturer_id, 
              l.name, 
              l.email, 
              GROUP_CONCAT(m.module_name ORDER BY m.module_name ASC SEPARATOR ', ') AS module_names
          FROM 
              Lecturer l
          LEFT JOIN Teaching t ON l.lecturer_id = t.lecturer_id
          LEFT JOIN Module m ON t.module_id = m.module_id
          GROUP BY 
              l.lecturer_id
          ORDER BY 
              l.name;
      `;
      db.query(query, (err, results) => {
          if (err) {
              reject(err);
          } else {
              resolve(results);
          }
      });
  });
};


// Get a lecturer by ID
exports.getLecturerById = async (lecturerId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Lecturer WHERE lecturer_id = ?', [lecturerId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
};

// Create a new lecturer
exports.createLecturer = async (name, email) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO Lecturer (name, email) VALUES (?, ?)', [name, email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.insertId);
            }
        });
    });
};

// Update a lecturer by ID
exports.updateLecturer = async (lecturerId, name, email) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE Lecturer SET name = ?, email = ? WHERE lecturer_id = ?', [name, email, lecturerId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Delete a lecturer by ID
exports.deleteLecturer = async (lecturerId) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM Lecturer WHERE lecturer_id = ?', [lecturerId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};