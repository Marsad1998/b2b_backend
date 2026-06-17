const db = require("../config/db");

// Get all products in the catalog
const getAllProducts = async () => {
  const [rows] = await db.query(
    `SELECT id, name, description, price, original_price, quantity, category, wholesaler_id, wholesaler_name, status FROM products`
  );
  return rows;
};

// Create a new product in the catalog
const createProduct = async ({ name, description, price, original_price, quantity, category, wholesaler_id, wholesaler_name, status }) => {
  const [result] = await db.query(
    `INSERT INTO products (name, description, price, original_price, quantity, category, wholesaler_id, wholesaler_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      description || null,
      price,
      original_price,
      quantity || 1,
      category,
      wholesaler_id,
      wholesaler_name,
      status || 'active'
    ]
  );
  return result.insertId;
};

// Delete a product from the catalog by ID
const deleteProduct = async (id) => {
  const [result] = await db.query(
    `DELETE FROM products WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

// Update product status (e.g. active, flagged)
const updateProductStatus = async (id, status) => {
  const [result] = await db.query(
    `UPDATE products SET status = ? WHERE id = ?`,
    [status, id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProductStatus
};
