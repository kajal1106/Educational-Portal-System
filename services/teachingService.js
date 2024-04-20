const db = require('../config/dbConfig');

exports.getAllTeachings = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Teaching', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.getTeachingById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Teaching WHERE teaching_id = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

exports.createTeaching = (lecturer_id, module_id) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO Teaching (lecturer_id, module_id) VALUES (?, ?)', [lecturer_id, module_id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.updateTeaching = (id, lecturer_id, module_id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE Teaching SET lecturer_id = ?, module_id = ? WHERE teaching_id = ?', [lecturer_id, module_id, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.deleteTeaching = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Teaching WHERE teaching_id = ?', [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};