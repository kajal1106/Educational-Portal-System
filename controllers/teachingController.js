const teachingService = require('../services/teachingService');

exports.getAllTeachings = async (req, res) => {
  try {
    const teachings = await teachingService.getAllTeachings();
    res.json(teachings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTeachingById = async (req, res) => {
  const { id } = req.params;
  try {
    const teaching = await teachingService.getTeachingById(id);
    if (!teaching) {
      return res.status(404).json({ error: 'Teaching not found' });
    }
    res.json(teaching);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createTeaching = async (req, res) => {
  const { lecturer_id, module_id } = req.body;
  try {
    await teachingService.createTeaching(lecturer_id, module_id);
    res.status(201).send('Teaching created successfully');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateTeaching = async (req, res) => {
  const { id } = req.params;
  const { lecturer_id, module_id } = req.body;
  try {
    await teachingService.updateTeaching(id, lecturer_id, module_id);
    res.send('Teaching updated successfully');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTeaching = async (req, res) => {
  const { id } = req.params;
  try {
    await teachingService.deleteTeaching(id);
    res.send('Teaching deleted successfully');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
