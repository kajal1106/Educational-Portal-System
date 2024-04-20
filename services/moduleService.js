// services/moduleService.js

const db = require('../config/dbConfig');

exports.getAllModules = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Module', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.getModuleById = (moduleId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Module WHERE module_id = ?', [moduleId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

exports.createModule = (moduleName) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO Module (module_name) VALUES (?)', [moduleName], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.updateModule = (moduleId, moduleName) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE Module SET module_name = ? WHERE module_id = ?', [moduleName, moduleId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.deleteModule = (moduleId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Module WHERE module_id = ?', [moduleId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
