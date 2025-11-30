const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  list += "</ul>";
  return list;
};

Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}"></a>`;
      grid += `<div class="namePrice"><hr><h2><a href="../../inv/detail/${vehicle.inv_id}">${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`;
      grid += `<span>$${new Intl.NumberFormat("en-US").format(
        vehicle.inv_price
      )}</span></div>`;
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleGrid = async function (data) {
  if (!data || data.length === 0)
    return "<p class='notice'>Vehicle not found.</p>";

  const vehicle = data[0];
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price);
  const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles);

  return `
  <section class="vehicle-detail-container">
    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
    </div>
    <div class="vehicle-info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <div class="price-box">
        <span>Price:</span>
        <strong>${price}</strong>
      </div>
      <p class="vehicle-miles"><strong>Mileage:</strong> ${miles} miles</p>
      <p class="vehicle-description">${vehicle.inv_description}</p>
      <ul class="vehicle-specs">
        <li><strong>Color:</strong> ${vehicle.inv_color}</li>
        <li><strong>Model:</strong> ${vehicle.inv_model}</li>
        <li><strong>Make:</strong> ${vehicle.inv_make}</li>
        <li><strong>Year:</strong> ${vehicle.inv_year}</li>
        <li><strong>Vehicle ID:</strong> ${vehicle.inv_id}</li>
      </ul>
    </div>
  </section>
  `;
};

/* ****************************************
 * Build the classification list (dropdown)
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware to check for SSL/TLS
 **************************************** */
Util.checkSsl = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    console.error(`Redireccionando de HTTP a HTTPS: ${req.originalUrl}`);
    const secureUrl = 'https://' + req.headers.host + req.url;
    return res.redirect(301, secureUrl);
  }
  next();
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login - Verifies user is logged in
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Account Type (TASK 2)
 *  Only allows Employee or Admin
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type;
    if (accountType === "Employee" || accountType === "Admin") {
      next();
    } else {
      req.flash("notice", "You do not have permission to access this resource.");
      return res.redirect("/account/login");
    }
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;