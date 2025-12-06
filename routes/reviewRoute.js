const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
const reviewValidate = require("../utilities/review-validation");

// ========================================
// PROTECTED ROUTES (Login required)
// ========================================

// View user's own reviews
router.get(
  "/my-reviews",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.viewMyReviews)
);

// Add review form
router.get(
  "/add/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildAddReview)
);

// Process add review
router.post(
  "/add",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

// Edit review form
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
);

// Process edit review
router.post(
  "/update",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkUpdateReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

// Delete review confirmation
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildDeleteReview)
);

// Process delete review
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;