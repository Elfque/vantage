const uuid = require("uuid");

const createPortfolio = async (req, res, db) => {
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
    const header = await db.run(
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
    console.log(header);
    // 2. Insert Projects
    if (projects && projects.length > 0) {
      for (const proj of projects) {
        const projectId = uuid.v4();
        await db.run(
          "INSERT INTO projects (portfolioId,  title, description, link, githubUrl, userId,id) VALUES (?, ?, ?, ?, ?,?,?)",
          [
            newId,
            proj.title,
            proj.description,
            proj.link,
            proj.githubUrl,
            userId,
            projectId,
          ],
        );
      }
    }

    // // 3. Insert Experience
    if (experience && experience.length > 0) {
      for (const exp of experience) {
        const expId = uuid.v4();
        await db.run(
          "INSERT INTO experiences (portfolioId, company, role, description, startDate, endDate, userId, id) VALUES (?, ?, ?, ?, ?, ?,?,?)",
          [
            newId,
            exp.company,
            exp.role,
            exp.description,
            exp.startDate,
            exp.endDate,
            userId,
            expId,
          ],
        );
      }
    }

    // 3. Insert Skills
    if (skills && skills.length > 0) {
      for (const exp of skills) {
        const skillsId = uuid.v4();
        await db.run(
          "INSERT INTO skillCategory (portfolioId, skills, category, userId,id) VALUES (?, ?, ?, ?,?)",
          [newId, JSON.stringify(exp.skills), exp.category, userId, skillsId],
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

const getAllPortfolios = async (req, res, db) => {
  const userId = req.user.userId;

  try {
    const portfolios = await db.all(
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

const getSinglePortfolio = async (req, res, db) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const portfolio = await db.all(
      "SELECT * FROM portfolios WHERE id = ? AND userId = ?",
      [id, userId],
    );

    if (portfolio.length === 0) {
      return res
        .status(404)
        .json({ message: "Portfolio not found or unauthorized." });
    }

    const projects = await db.all(
      "SELECT * FROM projects WHERE portfolioId = ?",
      [id],
    );

    const skills = await db.all(
      "SELECT * FROM skillCategory WHERE portfolioId = ?",
      [id],
    );

    const experience = await db.all(
      "SELECT * FROM experiences WHERE portfolioId = ?",
      [id],
    );

    const fullPortfolio = {
      ...portfolio[0],
      projects,
      skills,
      experience,
    };

    res.status(200).json(fullPortfolio);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching portfolio details." });
  }
};

const getSinglePortfolioBySlug = async (req, res, db) => {
  const { slug } = req.params;

  try {
    const portfolio = await db.all("SELECT * FROM portfolios WHERE slug = ?", [
      slug,
    ]);

    if (portfolio.length === 0) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const projects = await db.all(
      "SELECT * FROM projects WHERE portfolioId = ?",
      [portfolio[0].id],
    );

    const skills = await db.all(
      "SELECT * FROM skillCategory WHERE portfolioId = ?",
      [portfolio[0].id],
    );
    const experiences = await db.all(
      "SELECT * FROM experiences WHERE portfolioId = ?",
      [portfolio[0].id],
    );

    const { id, ...rest } = portfolio[0];
    const fullPortfolio = {
      ...rest,
      projects,
      skills,
      experiences,
    };

    res.status(200).json(fullPortfolio);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching portfolio details." });
  }
};

const updatePortfolio = async (req, res, db) => {
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
    const updateHeader = await db.run(
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

    if (updateHeader.changes === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or Portfolio not found." });
    }

    // Sync projects
    const rows = await db.all("SELECT id FROM projects WHERE portfolioId = ?", [
      id,
    ]);
    const existingIds = rows.map((r) => r.id);
    const incomingIds = projects
      .filter((item) => item.id)
      .map((item) => item.id);

    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));
    if (idsToDelete.length > 0) {
      await db.run("DELETE FROM projects WHERE id IN (?)", [idsToDelete]);
    }

    for (const proj of projects) {
      if (proj.id) {
        await db.run(
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
        const projectId = uuid.v4();
        await db.run(
          "INSERT INTO projects (portfolioId, title, description, link, githubUrl, id) VALUES (?, ?, ?, ?, ?, ?)",
          [
            id,
            proj.title,
            proj.description,
            proj.link,
            proj.githubUrl,
            projectId,
          ],
        );
      }
    }

    // Sync experience
    if (experience && Array.isArray(experience)) {
      const expRows = await db.all(
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
        await db.run("DELETE FROM experiences WHERE id IN (?)", [
          expIdsToDelete,
        ]);
      }

      for (const exp of experience) {
        if (exp.id) {
          // Update existing experience
          await db.run(
            "UPDATE experiences SET company = ?, role = ?, description = ?, startDate = ?, endDate = ? WHERE id = ? AND portfolioId = ?",
            [
              exp.company,
              exp.role,
              exp.description,
              exp.startDate,
              exp.endDate,
              exp.id,
              id,
            ],
          );
        } else {
          // Insert new experience
          const experienceId = uuid.v4();
          await db.run(
            "INSERT INTO experiences (portfolioId, company, role, description, startDate, endDate, id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              id,
              exp.company,
              exp.role,
              exp.description,
              exp.startDate,
              exp.endDate,
              experienceId,
            ],
          );
        }
      }
    }

    if (skills && Array.isArray(skills)) {
      const expRows = await db.all(
        "SELECT id FROM skillCategory WHERE portfolioId = ?",
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
        await db.run("DELETE FROM skillCategory WHERE id IN (?)", [
          skillsIdsToDelete,
        ]);
      }

      for (const skill of skills) {
        if (skill.id) {
          // Update existing experience
          await db.run(
            "UPDATE skillCategory SET skills = ?, category = ? WHERE id = ? AND portfolioId = ?",
            [JSON.stringify(skill.skills), skill.category, skill.id, id],
          );
        } else {
          // Insert new experience
          const skillId = uuid.v4();
          await db.run(
            "INSERT INTO skillCategory (portfolioId, skills, category, userId, id) VALUES (?, ?, ?, ?, ?)",
            [id, JSON.stringify(skill.skills), skill.category, userId, skillId],
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

const deletePortfolio = async (req, res, db) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const result = await db.run(
      "DELETE FROM portfolios WHERE id = ? AND userId = ?",
      [id, userId],
    );

    if (result.changes === 0) {
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
