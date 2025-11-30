const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.retrieveVehicleById));

// ========================================
// PROTECTED ROUTES (Employee/Admin only)
// ========================================

// Management view (requires Employee or Admin)
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);

// Get inventory by classification
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// ========================================
// ADD CLASSIFICATION (Employee/Admin only)
// ========================================

router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// ========================================
// ADD INVENTORY (Employee/Admin only)
// ========================================

router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// ========================================
// EDIT INVENTORY (Employee/Admin only)
// ========================================

router.get(
  "/edit/:inventory_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);

router.post(
  "/update/",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// ========================================
// DELETE INVENTORY (Employee/Admin only)
// ========================================

router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteConfirmation)
);

router.post(
  "/delete",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;