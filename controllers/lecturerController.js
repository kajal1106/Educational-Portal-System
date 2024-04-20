const lecturerService = require('../services/lecturerService');

// Get all lecturers
exports.getAllLecturers = async (req, res) => {
    try {
        const lecturers = await lecturerService.getAllLecturers();
        res.json(lecturers);
    } catch (error) {
        res.status(500).send('Error fetching lecturers from database');
    }
};

// Get lecturer by ID
exports.getLecturerById = async (req, res) => {
    const { id } = req.params;
    try {
        const lecturer = await lecturerService.getLecturerById(id);
        if (!lecturer) {
            res.status(404).send('Lecturer not found');
        } else {
            res.json(lecturer);
        }
    } catch (error) {
        res.status(500).send('Error fetching lecturer from database');
    }
};

// Create a new lecturer
exports.createLecturer = async (req, res) => {
    const { name, email } = req.body;
    try {
        const newLecturerId = await lecturerService.createLecturer(name, email);
        res.status(201).json({ id: newLecturerId, message: 'Lecturer created successfully' });
    } catch (error) {
        res.status(500).send('Error creating lecturer');
    }
};

// Update lecturer by ID
exports.updateLecturer = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        await lecturerService.updateLecturer(id, name, email);
        res.send('Lecturer updated successfully');
    } catch (error) {
        res.status(500).send('Error updating lecturer');
    }
};

// Delete lecturer by ID
exports.deleteLecturer = async (req, res) => {
    const { id } = req.params;
    try {
        await lecturerService.deleteLecturer(id);
        res.send('Lecturer deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting lecturer');
    }
};
