const connect = require("../db/db");
const uuid = require("uuid");

const createPortfolio = async (req, res) => {
  const {
    title,
    bio,
    slug,
    theme_color,
    projects,
    full_name,
    contact_email,
    github_url,
    linkedin_url,
    summary,
    experience,
  } = req.body;
  // socials,
  const userId = req.user.userId;
  const newId = uuid.v4();

  try {
    const [header] = await connect.execute(
      "INSERT INTO portfolios (user_id, title, bio, slug, theme_color, full_name, contact_email, github_url, linkedin_url, summary, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        title,
        bio,
        slug,
        theme_color,
        full_name,
        contact_email,
        github_url,
        linkedin_url,
        summary,
        newId,
      ]
    );

    // 2. Insert Projects
    if (projects && projects.length > 0) {
      for (const proj of projects) {
        await connect.execute(
          "INSERT INTO portfolio_projects (portfolio_id, name, description, image_url, live_url, github_url, tags) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            newId,
            proj.name,
            proj.description,
            proj.image_url ?? "",
            proj.live_url,
            proj.github_url,
            proj.tags,
          ]
        );
      }
    }

    // 3. Insert Experience
    if (experience && experience.length > 0) {
      for (const exp of experience) {
        await connect.execute(
          "INSERT INTO portfolio_experience (portfolio_id, company, position, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
          [
            newId,
            exp.company,
            exp.position,
            exp.description,
            exp.start_date,
            exp.end_date,
          ]
        );
      }
    }

    // 4. Insert Social Links
    // if (socials && socials.length > 0) {
    //   for (const link of socials) {
    //     await connection.execute(
    //       "INSERT INTO social_links (portfolio_id, platform, url) VALUES (?, ?, ?)",
    //       [portfolioId, link.platform, link.url]
    //     );
    //   }
    // }

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
      "SELECT id, title, bio, slug, theme_color, full_name, contact_email, github_url, linkedin_url, summary, created_at FROM portfolios WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
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
      "SELECT * FROM portfolios WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (portfolio.length === 0) {
      return res
        .status(404)
        .json({ message: "Portfolio not found or unauthorized." });
    }

    const [projects] = await connect.execute(
      "SELECT * FROM portfolio_projects WHERE portfolio_id = ?",
      [id]
    );

    const fullPortfolio = {
      ...portfolio[0],
      projects,
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
      [slug]
    );

    if (portfolio.length === 0) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const [projects] = await connect.execute(
      "SELECT * FROM portfolio_projects WHERE portfolio_id = ?",
      [portfolio[0].id]
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
    bio,
    slug,
    theme_color,
    projects,
    full_name,
    contact_email,
    github_url,
    linkedin_url,
    summary,
    experience,
  } = req.body;

  try {
    const [updateHeader] = await connect.execute(
      "UPDATE portfolios SET title = ?, bio = ?, slug = ?, theme_color = ?, full_name = ?, contact_email = ?, github_url = ?, linkedin_url = ?, summary = ? WHERE id = ? AND user_id = ?",
      [
        title,
        bio,
        slug,
        theme_color,
        full_name,
        contact_email,
        github_url,
        linkedin_url,
        summary,
        id,
        userId,
      ]
    );

    if (updateHeader.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or Portfolio not found." });
    }

    // Sync projects
    const [rows] = await connect.execute(
      "SELECT id FROM portfolio_projects WHERE portfolio_id = ?",
      [id]
    );
    const existingIds = rows.map((r) => r.id);
    const incomingIds = projects
      .filter((item) => item.id)
      .map((item) => item.id);

    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));
    if (idsToDelete.length > 0) {
      await connect.query("DELETE FROM portfolio_projects WHERE id IN (?)", [
        idsToDelete,
      ]);
    }

    for (const proj of projects) {
      if (proj.id) {
        // Update existing project
        await connect.execute(
          "UPDATE portfolio_projects SET name = ?, description = ?, image_url = ?, live_url = ?, github_url = ?, tags = ? WHERE id = ? AND portfolio_id = ?",
          [
            proj.name,
            proj.description,
            proj.image_url ?? "",
            proj.live_url,
            proj.github_url,
            proj.tags,
            proj.id,
            id,
          ]
        );
      } else {
        await connect.execute(
          "INSERT INTO portfolio_projects (portfolio_id, name, description, image_url, live_url, github_url, tags) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            id,
            proj.name,
            proj.description,
            proj.image_url ?? "",
            proj.live_url,
            proj.github_url,
            proj.tags,
          ]
        );
      }
    }

    // Sync experience
    if (experience && Array.isArray(experience)) {
      const [expRows] = await connect.execute(
        "SELECT id FROM portfolio_experience WHERE portfolio_id = ?",
        [id]
      );
      const existingExpIds = expRows.map((r) => r.id);
      const incomingExpIds = experience
        .filter((item) => item.id)
        .map((item) => item.id);

      const expIdsToDelete = existingExpIds.filter(
        (expId) => !incomingExpIds.includes(expId)
      );
      if (expIdsToDelete.length > 0) {
        await connect.query(
          "DELETE FROM portfolio_experience WHERE id IN (?)",
          [expIdsToDelete]
        );
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
            ]
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
            ]
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
      "DELETE FROM portfolios WHERE id = ? AND user_id = ?",
      [id, userId]
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
