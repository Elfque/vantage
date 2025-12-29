const connect = require("../db/db");
const uuid = require("uuid");

const createResume = async (req, res) => {
  const { title, summary, experience, education, skills, projects } = req.body;
  const userId = req.user.userId;

  const bulkInsert = async (table, data, query, mapper) => {
    if (data && Array.isArray(data) && data.length > 0) {
      for (const item of data) {
        await connect.execute(query, mapper(item));
      }
    }
  };

  try {
    const newId = uuid.v4();
    const [resumeResult] = await connect.execute(
      "INSERT INTO resumes (user_id, title, summary,id) VALUES (?, ?, ?, ?)",
      [userId, title, summary, newId]
    );
    const resumeId = newId;

    if (experience && experience.length > 0) {
      const expQueries = experience.map((exp) => {
        return connect.execute(
          "INSERT INTO experience (resume_id, company, position, description) VALUES (?, ?, ?, ?)",
          [resumeId, exp.company, exp.position, exp.description]
        );
      });
      await Promise.all(expQueries);
    }

    if (education && Array.isArray(education) && education.length > 0) {
      const eduQueries = education.map((edu) => {
        return connect.execute(
          "INSERT INTO education (resume_id, school, degree, field_of_study, graduation_date) VALUES (?, ?, ?, ?, ?)",
          [
            resumeId,
            edu.school,
            edu.degree,
            edu.field_of_study,
            edu.graduation_date || null,
          ]
        );
      });
      await Promise.all(eduQueries);
    }

    await bulkInsert(
      "skills",
      skills,
      "INSERT INTO skills (resume_id, name, level) VALUES (?, ?, ?)",
      (s) => [resumeId, s.name, s.level]
    );

    await bulkInsert(
      "projects",
      projects,
      "INSERT INTO projects (resume_id, title, link, description, technologies) VALUES (?, ?, ?, ?, ?)",
      (p) => [resumeId, p.title, p.link, p.description, p.technologies]
    );

    // await connect.commit();
    res.status(201).json({ message: "Resume saved!", resumeId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save resume." });
  }
};

const getAllResumes = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [resumes] = await connect.execute(
      "SELECT id, title, summary, created_at FROM resumes WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Could not retrieve resumes." });
  }
};

const getSingleResume = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const [resume] = await connect.execute(
      "SELECT * FROM resumes WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (resume.length === 0) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized." });
    }

    const [education] = await connect.execute(
      "SELECT * FROM education WHERE resume_id = ?",
      [id]
    );
    const [experience] = await connect.execute(
      "SELECT * FROM experience WHERE resume_id = ?",
      [id]
    );
    const [skills] = await connect.execute(
      "SELECT * FROM skills WHERE resume_id = ?",
      [id]
    );
    const [projects] = await connect.execute(
      "SELECT * FROM projects WHERE resume_id = ?",
      [id]
    );

    const fullResume = {
      ...resume[0],
      education,
      experience,
      skills,
      projects,
    };

    res.status(200).json(fullResume);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resume details." });
  }
};

module.exports = { createResume, getAllResumes, getSingleResume };
