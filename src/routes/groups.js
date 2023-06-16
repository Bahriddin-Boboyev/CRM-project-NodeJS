const express = require("express");
const genValidator = require("../shared/validator");
const controllers = require("../controllers/groups");
const { isLoggedIn, hasRole } = require("../shared/auth");
const schemas = require("../controllers/groups/schemas");

const router = express.Router();

router.post(
  "/groups",
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  genValidator(schemas.postGroupSchema),
  controllers.postGroup
);

router.get("/groups", isLoggedIn, controllers.getGroups);

router.get("/groups/:id", isLoggedIn, controllers.getSingleGroup);

router.patch(
  "/groups/:id",
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  controllers.patchGroups
);

router.delete(
  "/groups/:id",
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  controllers.deleteGroup
);

router.post(
  "/groups/:id/students/:student_id",
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  genValidator(schemas.postStudentGroup),
  controllers.addStudentToGroup
);

router.get("/groups/:id/students", isLoggedIn, controllers.studentGroup);

router.delete(
  "/groups/:id/students/:student_id",
  isLoggedIn,
  hasRole(["admin", "super_admin"]),
  controllers.deleteGroupStudent
);

module.exports = router;
