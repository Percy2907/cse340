const reviewModel = require("../models/review-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

/* ****************************************
 * Build Add Review View
 **************************************** */
async function buildAddReview(req, res) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  
  // Get vehicle data
  const vehicleData = await invModel.getInventoryById(inv_id);
  
  if (!vehicleData) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("/");
  }

  // Check if user already reviewed this vehicle
  const existingReview = await reviewModel.hasUserReviewed(
    res.locals.accountData.account_id,
    inv_id
  );

  if (existingReview) {
    req.flash("notice", "You have already reviewed this vehicle. You can edit your existing review.");
    return res.redirect(`/review/edit/${existingReview.review_id}`);
  }

  res.render("review/add-review", {
    title: `Review ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    errors: null,
    inv_id,
    vehicleName: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
    review_text: "",
    review_rating: ""
  });
}

/* ****************************************
 * Process Add Review
 **************************************** */
async function addReview(req, res) {
  const { review_text, review_rating, inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;
  const nav = await utilities.getNav();

  // Check if user already reviewed
  const existingReview = await reviewModel.hasUserReviewed(account_id, inv_id);
  
  if (existingReview) {
    req.flash("notice", "You have already reviewed this vehicle.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }

  const result = await reviewModel.addReview(
    review_text,
    parseInt(review_rating),
    account_id,
    parseInt(inv_id)
  );

  if (result) {
    req.flash("notice", "Your review has been added successfully.");
    return res.redirect(`/inv/detail/${inv_id}`);
  } else {
    const vehicleData = await invModel.getInventoryById(inv_id);
    req.flash("notice", "Sorry, adding the review failed.");
    return res.status(500).render("review/add-review", {
      title: `Review ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      errors: null,
      inv_id,
      vehicleName: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      review_text,
      review_rating
    });
  }
}

/* ****************************************
 * Build Edit Review View
 **************************************** */
async function buildEditReview(req, res) {
  const review_id = parseInt(req.params.review_id);
  const nav = await utilities.getNav();

  const reviewData = await reviewModel.getReviewById(review_id);

  if (!reviewData) {
    req.flash("notice", "Review not found.");
    return res.redirect("/account/");
  }

  // Check ownership
  if (reviewData.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only edit your own reviews.");
    return res.redirect("/account/");
  }

  const vehicleData = await invModel.getInventoryById(reviewData.inv_id);

  res.render("review/edit-review", {
    title: `Edit Review for ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    review_rating: reviewData.review_rating,
    inv_id: reviewData.inv_id,
    vehicleName: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`
  });
}

/* ****************************************
 * Process Edit Review
 **************************************** */
async function updateReview(req, res) {
  const { review_id, review_text, review_rating, inv_id } = req.body;
  const nav = await utilities.getNav();

  // Verify ownership
  const reviewData = await reviewModel.getReviewById(review_id);
  if (reviewData.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only edit your own reviews.");
    return res.redirect("/account/");
  }

  const result = await reviewModel.updateReview(
    parseInt(review_id),
    review_text,
    parseInt(review_rating)
  );

  if (result) {
    req.flash("notice", "Your review has been updated successfully.");
    return res.redirect(`/inv/detail/${inv_id}`);
  } else {
    const vehicleData = await invModel.getInventoryById(inv_id);
    req.flash("notice", "Sorry, updating the review failed.");
    return res.status(500).render("review/edit-review", {
      title: `Edit Review for ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      errors: null,
      review_id,
      review_text,
      review_rating,
      inv_id,
      vehicleName: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`
    });
  }
}

/* ****************************************
 * Build Delete Review Confirmation
 **************************************** */
async function buildDeleteReview(req, res) {
  const review_id = parseInt(req.params.review_id);
  const nav = await utilities.getNav();

  const reviewData = await reviewModel.getReviewById(review_id);

  if (!reviewData) {
    req.flash("notice", "Review not found.");
    return res.redirect("/account/");
  }

  // Check ownership
  if (reviewData.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only delete your own reviews.");
    return res.redirect("/account/");
  }

  const vehicleData = await invModel.getInventoryById(reviewData.inv_id);

  res.render("review/delete-review", {
    title: `Delete Review`,
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    review_rating: reviewData.review_rating,
    inv_id: reviewData.inv_id,
    vehicleName: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`
  });
}

/* ****************************************
 * Process Delete Review
 **************************************** */
async function deleteReview(req, res) {
  const { review_id, inv_id } = req.body;

  // Verify ownership
  const reviewData = await reviewModel.getReviewById(review_id);
  if (reviewData.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only delete your own reviews.");
    return res.redirect("/account/");
  }

  const result = await reviewModel.deleteReview(parseInt(review_id));

  if (result) {
    req.flash("notice", "Your review has been deleted successfully.");
    return res.redirect(`/inv/detail/${inv_id}`);
  } else {
    req.flash("notice", "Sorry, deleting the review failed.");
    return res.redirect(`/review/delete/${review_id}`);
  }
}

/* ****************************************
 * View User's Reviews
 **************************************** */
async function viewMyReviews(req, res) {
  const nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;

  const reviews = await reviewModel.getReviewsByUserId(account_id);

  res.render("review/my-reviews", {
    title: "My Reviews",
    nav,
    reviews,
    errors: null
  });
}

module.exports = {
  buildAddReview,
  addReview,
  buildEditReview,
  updateReview,
  buildDeleteReview,
  deleteReview,
  viewMyReviews
};