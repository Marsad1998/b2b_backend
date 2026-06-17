const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");

const getPendingWholesalers = async (req, res) => {
  try {
    // Only allow admin role to access this controller
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Admin privileges required." });
    }

    const wholesalers = await UserModel.findPendingWholesalers();
    return res.status(200).json({
      success: true,
      data: wholesalers
    });
  } catch (err) {
    console.error("getPendingWholesalers error:", err);
    return res.status(500).json({ success: false, message: "Server error retrieving pending businesses" });
  }
};

const updateBusinessStatus = async (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({ success: false, message: "userId and status are required" });
  }

  // Validate status values
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value. Must be 'approved', 'rejected', or 'pending'." });
  }

  try {
    // Only allow admin role to access this controller
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Admin privileges required." });
    }

    const updated = await UserModel.updateUserStatus(userId, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found or status update failed" });
    }

    console.log(`💼 Business status updated: User #${userId} is now ${status}`);
    return res.status(200).json({
      success: true,
      message: `Business status successfully updated to ${status}.`
    });
  } catch (err) {
    console.error("updateBusinessStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error updating status" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Only allow admin role to access this controller
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Admin privileges required." });
    }

    const products = await ProductModel.getAllProducts();
    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (err) {
    console.error("getAllProducts error:", err);
    return res.status(500).json({ success: false, message: "Server error retrieving products" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Only allow admin role to access this controller
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Admin privileges required." });
    }

    const deleted = await ProductModel.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found or deletion failed" });
    }

    console.log(`📦 Product deleted by Admin: Product #${id}`);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully from the catalog."
    });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ success: false, message: "Server error deleting product" });
  }
};

const updateProductStatus = async (req, res) => {
  const { productId, status } = req.body;

  if (!productId || !status) {
    return res.status(400).json({ success: false, message: "productId and status are required" });
  }

  try {
    // Only allow admin role to access this controller
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Admin privileges required." });
    }

    const updated = await ProductModel.updateProductStatus(productId, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found or status update failed" });
    }

    console.log(`📦 Product status updated by Admin: Product #${productId} status is now ${status}`);
    return res.status(200).json({
      success: true,
      message: `Product status updated to ${status}.`
    });
  } catch (err) {
    console.error("updateProductStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error updating product status" });
  }
};

module.exports = {
  getPendingWholesalers,
  updateBusinessStatus,
  getAllProducts,
  deleteProduct,
  updateProductStatus
};
