const pool = require("../database");

/* ***************************
 *   Register New Account
 * ************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    console.error("Register Error:", error);
    return null;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [email]);
    return result.rowCount;
  } catch (error) {
    console.error("Email check failed:", error);
    return null;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id (TASK 5)
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error getting account by ID:", error);
    return null;
  }
}

/* *****************************
* Update account information (TASK 5)
* firstname, lastname, email based on account_id
* ***************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = 
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Update Account Error:", error);
    return null;
  }
}

/* *****************************
* Update password (TASK 5)
* Updates password hash based on account_id
* ***************************** */
async function updatePassword(account_password, account_id) {
  try {
    const sql = 
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [account_password, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Update Password Error:", error);
    return null;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
};