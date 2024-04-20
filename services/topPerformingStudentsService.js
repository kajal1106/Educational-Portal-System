const db = require('../config/dbConfig');

exports.getTopPerformingStudents = () => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT 
          s.student_id,
          s.name AS student_name,
          s.email AS student_email,
          m.module_name,
          MAX(ga.score) AS top_score
      FROM 
          Student s
      JOIN 
          GradeAssignment ga ON s.student_id = ga.student_id
      JOIN
          Module m ON ga.module_id = m.module_id
      GROUP BY 
          s.student_id, s.name, s.email, m.module_name
      ORDER BY 
        top_score DESC;
    `, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};