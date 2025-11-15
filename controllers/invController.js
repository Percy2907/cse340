const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 * Build inventory by classification
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  if (!data || data.length === 0) {
    return res.status(404).render("errors/error", {
      title: "Classification Not Found",
      message: "No vehicles found for this classification."
    });
  }

  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid
  });
};

/* ***************************
 * Retrieve vehicle detail by ID
 ************************** */
invCont.retrieveVehicleById = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId;
  const data = await invModel.getVehicleById(vehicle_id);

  if (!data || data.length === 0) {
    return res.status(404).render("errors/error", {
      title: "Vehicle Not Found",
      message: "The vehicle you requested could not be found."
    });
  }

  const grid = await utilities.buildVehicleGrid(data);
  const nav = await utilities.getNav();
  const className = `${data[0].inv_make} ${data[0].inv_model}`;

  res.render("./inventory/vehicle", {
    title: className,
    nav,
    grid
  });
};

module.exports = invCont;