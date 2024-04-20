const auditLogService = require('../services/auditLogService');

// Get all audit logs
exports.getAllAuditLogs = async (req, res) => {
  try {
    const auditLogs = await auditLogService.getAllAuditLogs();
    res.json(auditLogs);
  } catch (error) {
    res.status(500).send('Error fetching audit logs');
  }
};

// Get audit log by ID
exports.getAuditLogById = async (req, res) => {
  const { id } = req.params;
  try {
    const auditLog = await auditLogService.getAuditLogById(id);
    if (!auditLog) {
      res.status(404).send('Audit log not found');
    } else {
      res.json(auditLog);
    }
  } catch (error) {
    res.status(500).send('Error fetching audit log');
  }
};

// Create a new audit log
exports.createAuditLog = async (req, res) => {
  const { user_id, action } = req.body;
  try {
    await auditLogService.createAuditLog(user_id, action);
    res.status(201).send('Audit log created successfully');
  } catch (error) {
    res.status(500).send('Error creating audit log');
  }
};

// Delete audit log by ID
exports.deleteAuditLog = async (req, res) => {
  const { id } = req.params;
  try {
    await auditLogService.deleteAuditLog(id);
    res.send('Audit log deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting audit log');
  }
};
