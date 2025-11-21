const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");

/* **********************************
 * Registration Rules
 *********************************** */
validate.registationRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("Please provide a first name."),

    body("account_lastname").trim().notEmpty().withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (email) => {
        const exists = await accountModel.checkExistingEmail(email);
        if (exists) {
          throw new Error("Email exists. Please log in or use another email.");
        }
      }),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* **********************************
 * Check Registration Data
 *********************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/register", {
      errors,
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
  next();
};

/* **********************************
 * Login validation
 *********************************** */
validate.loginRules = () => {
  return [
    body("account_email").trim().isEmail().withMessage("Enter a valid email."),
    body("account_password").trim().notEmpty().withMessage("Password is required."),
  ];
};

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
  }
  next();
};

module.exports = validate;