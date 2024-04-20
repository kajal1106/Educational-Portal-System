const db = require('../config/dbConfig');

// Get all audit logs
exports.getAllAuditLogs = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM AuditLog', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Get audit log by ID
exports.getAuditLogById = (log_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM AuditLog WHERE log_id = ?', [log_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Create a new audit log
exports.createAuditLog = (user_id, action) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO AuditLog (user_id, action) VALUES (?, ?)', [user_id, action], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Delete audit log by ID
exports.deleteAuditLog = (log_id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM AuditLog WHERE log_id = ?', [log_id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
