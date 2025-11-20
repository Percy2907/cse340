const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null, 
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
}

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  const errors = [];

  if (!account_firstname || account_firstname.trim() === "") {
    errors.push({ field: "account_firstname", msg: "First name is required." });
  }
  if (!account_lastname || account_lastname.trim() === "") {
    errors.push({ field: "account_lastname", msg: "Last name is required." });
  }
  if (!account_email || account_email.trim() === "") {
    errors.push({ field: "account_email", msg: "Email is required." });
  }
  if (!account_password || account_password.trim() === "") {
    errors.push({ field: "account_password", msg: "Password is required." });
  } else {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
    if (!passwordPattern.test(account_password)) {
      errors.push({ field: "account_password", msg: "Password must be 12+ chars, 1 uppercase, 1 number, 1 special." });
    }
  }

  if (errors.length > 0) {
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    return res.redirect("/account/login");
  } else {
    req.flash("error", "Sorry, the registration failed.");
    return res.redirect("/account/register");
  }
}

module.exports = { buildLogin, buildRegister, registerAccount };