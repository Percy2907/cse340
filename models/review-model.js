const pool = require("../database");

/* ***************************
 * Add New Review
 ************************** */
async function addReview(review_text, review_rating, account_id, inv_id) {
  try {
    const sql = `INSERT INTO review (review_text, review_rating, account_id, inv_id) 
                 VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(sql, [review_text, review_rating, account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Add Review Error:", error);
    return null;
  }
}

/* ***************************
 * Get Reviews by Vehicle ID
 ************************** */
async function getReviewsByVehicleId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM review r
                 JOIN account a ON r.account_id = a.account_id
                 WHERE r.inv_id = $1
                 ORDER BY r.review_date DESC`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return [];
  }
}

/* ***************************
 * Get Average Rating by Vehicle ID
 ************************** */
async function getAverageRating(inv_id) {
  try {
    const sql = `SELECT AVG(review_rating)::NUMERIC(10,1) as avg_rating, 
                 COUNT(*) as review_count 
                 FROM review 
                 WHERE inv_id = $1`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Get Average Rating Error:", error);
    return { avg_rating: 0, review_count: 0 };
  }
}

/* ***************************
 * Get Review by ID
 ************************** */
async function getReviewById(review_id) {
  try {
    const sql = `SELECT * FROM review WHERE review_id = $1`;
    const result = await pool.query(sql, [review_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Get Review By ID Error:", error);
    return null;
  }
}

/* ***************************
 * Update Review
 ************************** */
async function updateReview(review_id, review_text, review_rating) {
  try {
    const sql = `UPDATE review 
                 SET review_text = $1, review_rating = $2 
                 WHERE review_id = $3 
                 RETURNING *`;
    const result = await pool.query(sql, [review_text, review_rating, review_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Update Review Error:", error);
    return null;
  }
}

/* ***************************
 * Delete Review
 ************************** */
async function deleteReview(review_id) {
  try {
    const sql = `DELETE FROM review WHERE review_id = $1`;
    const result = await pool.query(sql, [review_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Delete Review Error:", error);
    return false;
  }
}

/* ***************************
 * Check if User Already Reviewed Vehicle
 ************************** */
async function hasUserReviewed(account_id, inv_id) {
  try {
    const sql = `SELECT review_id FROM review WHERE account_id = $1 AND inv_id = $2`;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Check User Review Error:", error);
    return null;
  }
}

/* ***************************
 * Get Reviews by User ID
 ************************** */
async function getReviewsByUserId(account_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
                 FROM review r
                 JOIN inventory i ON r.inv_id = i.inv_id
                 WHERE r.account_id = $1
                 ORDER BY r.review_date DESC`;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error("Get Reviews By User Error:", error);
    return [];
  }
}

module.exports = {
  addReview,
  getReviewsByVehicleId,
  getAverageRating,
  getReviewById,
  updateReview,
  deleteReview,
  hasUserReviewed,
  getReviewsByUserId
};