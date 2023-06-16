const router = require("express").Router();
const genValidator = require("../shared/validator");
const controllers = require("../controllers/direction");
const { isLoggedIn, hasRole } = require("../shared/auth");
const schemas = require("../controllers/direction/schemas");

router.post(
  "/direction",
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  genValidator(schemas.postDirectionSchema),
  controllers.postDirection
);

router.get("/direction", isLoggedIn, controllers.getDirection);

router.get("/direction/:id", isLoggedIn, controllers.getSingleDirection);

router.patch(
  "/direction/:id",
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  genValidator(schemas.postDirectionSchema),
  controllers.updateDirection
);

router.delete(
  "/direction/:id",
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  controllers.deleteDirection
);

module.exports = router;
