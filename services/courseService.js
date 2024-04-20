const db = require('../config/dbConfig');

exports.uploadMaterials = (moduleId, title, description, filePath) => {
  const uploadDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Materials (module_id, title, description, file_path, upload_date) VALUES (?, ?, ?, ?, ?)',
      [moduleId, title, description, filePath, uploadDate],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

exports.createAssignment = (moduleId, title, description, dueDate) => {
  const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Assignments (module_id, title, description, due_date, creation_date) VALUES (?, ?, ?, ?, ?)',
      [moduleId, title, description, dueDate, creationDate],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

exports.getAllAssignments = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Assignments', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.deleteAssignment = (assignmentId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Assignments WHERE assignment_id = ?', [assignmentId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

exports.updateAssignment = (assignmentId, title, moduleId, description, dueDate, creationDate) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE Assignments SET title = ?, module_id = ?, description = ?, due_date = ?, creation_date = ? WHERE assignment_id = ?',
      [title, moduleId, description, dueDate, creationDate, assignmentId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

exports.enterLectureNotes = (moduleId, topic, content) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO LectureNotes (module_id, topic, content, date) VALUES (?, ?, ?, ?)',
      [moduleId, topic, content, date],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};
