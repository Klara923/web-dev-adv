const { query } = require("../db.js");

async function getAllVenues() {
  try {
    const result = await query("SELECT * FROM venues ORDER BY name ASC");
    return result.rows;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
}

async function getVenueById(id) {
  try {
    const result = await query("SELECT * FROM venues WHERE id = $1", [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`Error fetching venue with ID ${id}:`, error);
    throw error;
  }
}

async function addVenue(vname, vurl, vdistrict) {
  try {
    await query(
      "INSERT INTO venues (name, url, district) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING",
      [vname, vurl, vdistrict]
    );
    return { message: "Venue added successfully" };
  } catch (error) {
    console.error("Error adding venue:", error);
    throw error;
  }
}

async function updateVenue(id, name, url, district) {
  try {
    const result = await query(
      "UPDATE venues SET name = $1, url = $2, district = $3 WHERE id = $4 RETURNING *",
      [name, url, district, id]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error updating venue with ID ${id}:`, error);
    throw error;
  }
}

async function deleteVenue(id) {
  try {
    const result = await query("DELETE FROM venues WHERE id = $1", [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting venue with ID ${id}:`, error);
    throw error;
  }
}

module.exports = {
  getAllVenues,
  getVenueById,
  addVenue,
  updateVenue,
  deleteVenue,
};
