const db = require('../config/dbConfig');

// Get all users
exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM User', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Get user by ID
exports.getUserById = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM User WHERE user_id = ?', [user_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Create a new user
exports.createUser = (username, password, role) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO User (username, password, role) VALUES (?, ?, ?)', [username, password, role], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Update user by ID
exports.updateUser = (user_id, username, password, role) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE User SET username = ?, password = ?, role = ? WHERE user_id = ?', [username, password, role, user_id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Delete user by ID
exports.deleteUser = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM User WHERE user_id = ?', [user_id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
