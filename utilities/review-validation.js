const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");

const validate = {};

/* **********************************
 * Review Validation Rules
 *********************************** */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),

    body("review_rating")
      .trim()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5 stars."),

    body("inv_id")
      .trim()
      .isInt()
      .withMessage("Invalid vehicle ID.")
      .custom(async (inv_id) => {
        const vehicle = await invModel.getInventoryById(inv_id);
        if (!vehicle) {
          throw new Error("Vehicle not found.");
        }
      })
  ];
};

/* **********************************
 * Check Review Data (for Add)
 *********************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, review_rating, inv_id } = req.body;
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const vehicleData = await invModel.getInventoryById(inv_id);
    
    return res.render("review/add-review", {
      errors,
      title: `Review ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      inv_id,
      vehicleName: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      review_text,
      review_rating
    });
  }
  next();
};

/* **********************************
 * Check Review Data (for Update)
 *********************************** */
validate.checkUpdateReviewData = async (req, res, next) => {
  const { review_text, review_rating, inv_id, review_id } = req.body;
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const vehicleData = await invModel.getInventoryById(inv_id);
    
    return res.render("review/edit-review", {
      errors,
      title: `Edit Review for ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      review_id,
      review_text,
      review_rating,
      inv_id,
      vehicleName: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`
    });
  }
  next();
};

module.exports = validate;