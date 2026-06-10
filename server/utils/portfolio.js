const connect = require("../db/db");
const uuid = require("uuid");

const createPortfolio = async (req, res) => {
  const {
    title,
    slug,
    colorTheme,
    projects,
    email,
    fullName,
    githubUrl,
    linkedlnUrl,
    description,
    experience,
    skills,
  } = req.body;

  const userId = req.user.userId;
  const newId = uuid.v4();

  try {
    const [header] = await connect.execute(
      "INSERT INTO portfolios (userId, title , slug, colorTheme, fullName, email, githubUrl, linkedlnUrl, description, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        title,
        slug,
        colorTheme,
        fullName,
        email,
        githubUrl,
        linkedlnUrl,
        description,
        newId,
      ],
    );

    // 2. Insert Projects
    if (projects && projects.length > 0) {
      for (const proj of projects) {
        await connect.execute(
          "INSERT INTO projects (portfolioId,  title, description, link, githubUrl, userId) VALUES (?, ?, ?, ?, ?,?)",
          [
            newId,
            proj.title,
            proj.description,
            proj.link,
            proj.githubUrl,
            userId,
          ],
        );
      }
    }

    // // 3. Insert Experience
    // if (experience && experience.length > 0) {
    //   for (const exp of experience) {
    //     await connect.execute(
    //       "INSERT INTO portfolio_experience (portfolio_id, company, position, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
    //       [
    //         newId,
    //         exp.company,
    //         exp.position,
    //         JSON.stringify(exp.description),
    //         exp.start_date,
    //         exp.end_date,
    //       ],
    //     );
    //   }
    // }

    // 3. Insert Skills
    if (skills && skills.length > 0) {
      for (const exp of skills) {
        await connect.execute(
          "INSERT INTO skills (portfolioId, name, proficiency, userId) VALUES (?, ?, ?, ?)",
          [newId, exp.name, exp.proficiency, userId],
        );
      }
    }

    res
      .status(201)
      .json({ message: "Portfolio created successfully!", id: newId });
  } catch (error) {
    console.log(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "That URL slug is already taken." });
    }
    res.status(500).json({ message: "Error creating portfolio." });
  }
};

const getAllPortfolios = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [portfolios] = await connect.execute(
      "SELECT id, title, slug, colorTheme, fullName, email, githubUrl, linkedlnUrl, description, createdAt FROM portfolios WHERE userId = ? ORDER BY createdAt DESC",
      [userId],
    );

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Could not retrieve portfolios." });
  }
};

const getSinglePortfolio = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const [portfolio] = await connect.execute(
      "SELECT * FROM portfolios WHERE id = ? AND userId = ?",
      [id, userId],
    );

    if (portfolio.length === 0) {
      return res
        .status(404)
        .json({ message: "Portfolio not found or unauthorized." });
    }

    const [projects] = await connect.execute(
      "SELECT * FROM projects WHERE portfolioId = ?",
      [id],
    );

    const [skills] = await connect.execute(
      "SELECT * FROM skills WHERE portfolioId = ?",
      [id],
    );

    const fullPortfolio = {
      ...portfolio[0],
      projects,
      skills,
    };

    res.status(200).json(fullPortfolio);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching portfolio details." });
  }
};

const getSinglePortfolioBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [portfolio] = await connect.execute(
      "SELECT * FROM portfolios WHERE slug = ?",
      [slug],
    );

    if (portfolio.length === 0) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const [projects] = await connect.execute(
      "SELECT * FROM projects WHERE portfolioId = ?",
      [portfolio[0].id],
    );

    const { id, ...rest } = portfolio[0];
    const fullPortfolio = {
      ...rest,
      projects,
    };

    res.status(200).json(fullPortfolio);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching portfolio details." });
  }
};

const updatePortfolio = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const {
    title,
    slug,
    colorTheme,
    projects,
    fullName,
    email,
    githubUrl,
    linkedlnUrl,
    description,
    experience,
    skills,
  } = req.body;

  try {
    const [updateHeader] = await connect.execute(
      "UPDATE portfolios SET title = ?, slug = ?, colorTheme = ?, fullName = ?, email = ?, githubUrl = ?, linkedlnUrl = ?, description = ? WHERE id = ? AND userId = ?",
      [
        title,
        slug,
        colorTheme,
        fullName,
        email,
        githubUrl,
        linkedlnUrl,
        description,
        id,
        userId,
      ],
    );

    if (updateHeader.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or Portfolio not found." });
    }

    // Sync projects
    const [rows] = await connect.execute(
      "SELECT id FROM projects WHERE portfolioId = ?",
      [id],
    );
    const existingIds = rows.map((r) => r.id);
    const incomingIds = projects
      .filter((item) => item.id)
      .map((item) => item.id);

    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));
    if (idsToDelete.length > 0) {
      await connect.query("DELETE FROM projects WHERE id IN (?)", [
        idsToDelete,
      ]);
    }

    for (const proj of projects) {
      if (proj.id) {
        await connect.execute(
          "UPDATE projects SET title = ?, description = ?, link = ?, githubUrl = ? WHERE id = ? AND portfolioId = ?",
          [
            proj.title,
            proj.description,
            proj.link,
            proj.githubUrl,
            proj.id,
            id,
          ],
        );
      } else {
        await connect.execute(
          "INSERT INTO projects (portfolioId, title, description, link, githubUrl) VALUES (?, ?, ?, ?, ?)",
          [id, proj.title, proj.description, proj.link, proj.githubUrl],
        );
      }
    }

    // Sync experience
    if (experience && Array.isArray(experience)) {
      const [expRows] = await connect.execute(
        "SELECT id FROM experiences WHERE portfolioId = ?",
        [id],
      );
      const existingExpIds = expRows.map((r) => r.id);
      const incomingExpIds = experience
        .filter((item) => item.id)
        .map((item) => item.id);

      const expIdsToDelete = existingExpIds.filter(
        (expId) => !incomingExpIds.includes(expId),
      );
      if (expIdsToDelete.length > 0) {
        await connect.query("DELETE FROM experiences WHERE id IN (?)", [
          expIdsToDelete,
        ]);
      }

      for (const exp of experience) {
        if (exp.id) {
          // Update existing experience
          await connect.execute(
            "UPDATE portfolio_experience SET company = ?, position = ?, description = ?, start_date = ?, end_date = ? WHERE id = ? AND portfolio_id = ?",
            [
              exp.company,
              exp.position,
              exp.description,
              exp.start_date,
              exp.end_date,
              exp.id,
              id,
            ],
          );
        } else {
          // Insert new experience
          await connect.execute(
            "INSERT INTO portfolio_experience (portfolio_id, company, position, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
            [
              id,
              exp.company,
              exp.position,
              exp.description,
              exp.start_date,
              exp.end_date,
            ],
          );
        }
      }
    }

    if (skills && Array.isArray(skills)) {
      const [expRows] = await connect.execute(
        "SELECT id FROM skills WHERE portfolioId = ?",
        [id],
      );
      const existingSkillsIds = expRows.map((r) => r.id);
      const incomingSkillsIds = skills
        .filter((item) => item.id)
        .map((item) => item.id);

      const skillsIdsToDelete = existingSkillsIds.filter(
        (expId) => !incomingSkillsIds.includes(expId),
      );
      if (skillsIdsToDelete.length > 0) {
        await connect.query("DELETE FROM skills WHERE id IN (?)", [
          skillsIdsToDelete,
        ]);
      }

      for (const skill of skills) {
        if (skill.id) {
          // Update existing experience
          await connect.execute(
            "UPDATE skills SET name = ?, proficiency = ? WHERE id = ? AND portfolioId = ?",
            [skill.name, skill.proficiency, skill.id, id],
          );
        } else {
          // Insert new experience
          await connect.execute(
            "INSERT INTO skills (portfolioId, name, proficiency, userId) VALUES (?, ?, ?, ?)",
            [id, skill.name, skill.proficiency, userId],
          );
        }
      }
    }

    res.status(200).json({ message: "Portfolio updated successfully!" });
  } catch (error) {
    console.error("Update Error:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "That URL slug is already taken." });
    }
    res.status(500).json({ message: "Failed to update portfolio." });
  }
};

const deletePortfolio = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const [result] = await connect.execute(
      "DELETE FROM portfolios WHERE id = ? AND userId = ?",
      [id, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Portfolio not found or you do not have permission to delete it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Portfolio and all associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete portfolio." });
  }
};

module.exports = {
  createPortfolio,
  getAllPortfolios,
  getSinglePortfolio,
  updatePortfolio,
  deletePortfolio,
  getSinglePortfolioBySlug,
};
