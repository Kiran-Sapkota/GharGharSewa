const express = require("express");

const {
  getAllUsers,
  getAllProvidersAdmin,
  getAllBookingsAdmin,
  verifyProvider,
  unverifyProvider,
  deactivateAccount,
  reactivateAccount,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.get("/providers", getAllProvidersAdmin);
router.get("/bookings", getAllBookingsAdmin);

router.patch("/providers/:providerId/verify", verifyProvider);
router.patch("/providers/:providerId/unverify", unverifyProvider);

router.patch("/users/:userId/deactivate", deactivateAccount);
router.patch("/users/:userId/reactivate", reactivateAccount);

module.exports = router;