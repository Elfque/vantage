const connect = require("../db/db");
const uuid = require("uuid");

const createResume = async (req, res) => {
  const {
    title,
    full_name,
    contact_email,
    phone,
    location,
    linkedin_url,
    website_url,
    summary,
    experience,
    education,
    skills,
    projects,
    portfolio_id,
  } = req.body;
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
      "INSERT INTO resumes (user_id, title, summary,id, full_name, contact_email, phone, location, linkedin_url, website_url,portfolio_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
      [
        userId,
        title,
        summary,
        newId,
        full_name,
        contact_email,
        phone,
        location,
        linkedin_url,
        website_url,
        portfolio_id,
      ]
    );
    const resumeId = newId;

    if (experience && experience.length > 0) {
      const expQueries = experience.map((exp) => {
        return connect.execute(
          "INSERT INTO experience (resume_id, company, position, description, start_date, end_date) VALUES (?, ?, ?, ?,?,?)",
          [
            resumeId,
            exp.company,
            exp.position,
            exp.description,
            exp.start_date,
            exp.end_date,
          ]
        );
      });
      await Promise.all(expQueries);
    }

    if (education && Array.isArray(education) && education.length > 0) {
      const eduQueries = education.map((edu) => {
        return connect.execute(
          "INSERT INTO education (resume_id, school, degree, field_of_study, graduation_date, start_date) VALUES (?, ?, ?, ?, ?,?)",
          [
            resumeId,
            edu.school,
            edu.degree,
            edu.field_of_study,
            edu.graduation_date || null,
            edu.start_date || null,
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

const updateResume = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const {
    title,
    full_name,
    contact_email,
    phone,
    location,
    linkedin_url,
    website_url,
    summary,
    education,
    experience,
    skills,
    projects,
    portfolio_id,
  } = req.body;

  try {
    const [updateHeader] = await connect.execute(
      "UPDATE resumes SET title = ?, summary = ?, full_name = ?, contact_email = ?, phone = ?, location = ?, linkedin_url = ?, website_url = ?, portfolio_id=? WHERE id = ? AND user_id = ?",
      [
        title,
        summary,
        full_name,
        contact_email,
        phone,
        location,
        linkedin_url,
        website_url,
        portfolio_id,
        id,
        userId,
      ]
    );

    if (updateHeader.affectedRows === 0) {
      await connect.rollback();
      return res
        .status(403)
        .json({ message: "Unauthorized or Resume not found." });
    }

    const syncSection = async (
      tableName,
      data,
      columns,
      insertSql,
      updateSql
    ) => {
      const [rows] = await connect.execute(
        `SELECT id FROM ${tableName} WHERE resume_id = ?`,
        [id]
      );
      const existingIds = rows.map((r) => r.id);
      const incomingIds = data.filter((item) => item.id).map((item) => item.id);

      const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));
      if (idsToDelete.length > 0) {
        await connect.query(`DELETE FROM ${tableName} WHERE id IN (?)`, [
          idsToDelete,
        ]);
      }

      for (const item of data) {
        if (item.id) {
          const updateValues = columns
            .map((col) => item[col])
            .concat([item.id, id]);
          await connect.execute(updateSql, updateValues);
        } else {
          const insertValues = [id].concat(columns.map((col) => item[col]));
          await connect.execute(insertSql, insertValues);
        }
      }
    };

    await syncSection(
      "experience",
      experience || [],
      ["company", "position", "description", "start_date", "end_date"],
      "INSERT INTO experience (resume_id, company, position, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
      "UPDATE experience SET company = ?, position = ?, description = ?, start_date = ?, end_date = ? WHERE id = ? AND resume_id = ?"
    );

    await syncSection(
      "skills",
      skills || [],
      ["name", "level"],
      "INSERT INTO skills (resume_id, name, level) VALUES (?, ?, ?)",
      "UPDATE skills SET name = ?, level = ? WHERE id = ? AND resume_id = ?"
    );

    await syncSection(
      "projects",
      projects || [],
      ["title", "link", "description", "technologies"],
      "INSERT INTO projects (resume_id, title, link, description, technologies) VALUES (?, ?, ?, ?, ?)",
      "UPDATE projects SET title = ?, link = ?, description = ?, technologies = ? WHERE id = ? AND resume_id = ?"
    );

    await syncSection(
      "education",
      education || [],
      ["school", "degree", "field_of_study", "graduation_date", "start_date"],
      "INSERT INTO education (resume_id, school, degree, field_of_study, graduation_date, start_date) VALUES (?, ?, ?, ?, ?, ?)",
      "UPDATE education SET school = ?, degree = ?, field_of_study = ?, graduation_date = ?, start_date = ? WHERE id = ? AND resume_id = ?"
    );

    res.status(200).json({ message: "Resume updated successfully!" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update resume." });
  }
};

const deleteResume = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  console.log(id, userId);

  try {
    const [result] = await connect.execute(
      "DELETE FROM resumes WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or you do not have permission to delete it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume and all associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to delete resume." });
  }
};

module.exports = {
  createResume,
  getAllResumes,
  getSingleResume,
  updateResume,
  deleteResume,
};
