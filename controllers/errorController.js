const errorController = {};

// 500 Intentional Error
errorController.throwError = (req, res, next) => {
  throw new Error("Intentional 500 Error for testing");
};

module.exports = errorController;