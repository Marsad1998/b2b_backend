const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { 
  getPendingWholesalers, 
  updateBusinessStatus,
  getAllProducts,
  deleteProduct,
  updateProductStatus
} = require("../controllers/adminController");

router.get("/pending-wholesalers", authMiddleware, getPendingWholesalers);
router.post("/update-status", authMiddleware, updateBusinessStatus);

router.get("/products", authMiddleware, getAllProducts);
router.delete("/products/:id", authMiddleware, deleteProduct);
router.post("/products/status", authMiddleware, updateProductStatus);

module.exports = router;
