const pool = require("../database");

async function getClassifications() {
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  return data.rows;
}

async function getInventoryByClassificationId(classification_id) {
  const data = await pool.query(
    `SELECT * FROM public.inventory AS i 
     JOIN public.classification AS c 
     ON i.classification_id = c.classification_id 
     WHERE i.classification_id = $1`,
    [classification_id]
  );
  return data.rows;
}

async function getVehicleById(vehicle_id) {
  const data = await pool.query(
    `SELECT * FROM public.inventory AS i WHERE i.inv_id = $1`,
    [vehicle_id]
  );
  return data.rows;
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById };