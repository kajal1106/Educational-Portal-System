const userService = require('../services/userService');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    await userService.createUser(username, password, role);
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send('Error creating user');
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    await userService.updateUser(id, username, password, role);
    res.send('User updated successfully');
  } catch (error) {
    res.status(500).send('Error updating user');
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userService.deleteUser(id);
    res.send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};
