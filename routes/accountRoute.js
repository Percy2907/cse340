const express = require("express");
const router = new express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// ========================================
// PUBLIC ROUTES (No login required)
// ========================================

// Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Deliver register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// ========================================
// PROTECTED ROUTES (Login required)
// ========================================

// Default account management view (requires login)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Deliver account update view (TASK 4 & 5)
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Process account update (TASK 5)
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password update (TASK 5)
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Logout (TASK 6)
router.get("/logout", accountController.logout);

module.exports = router;