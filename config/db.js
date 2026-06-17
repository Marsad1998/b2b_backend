const fs = require('fs');
const path = require('path');

const JSON_DB_PATH = path.join(__dirname, 'users.json');
const PRODUCTS_DB_PATH = path.join(__dirname, 'products.json');

// Pre-seed mock user data if file doesn't exist
if (!fs.existsSync(JSON_DB_PATH)) {
  const seedUsers = [
    {
      id: 1,
      name: "System Admin",
      email: "admin@productsphere.com",
      password: "adminpassword", // Plaintext for easy initial demo; in real signup we hash using bcrypt
      role: "admin",
      phone: "03001234567",
      gender: "male",
      status: "approved",
      license_no: null,
      business_address: null
    },
    {
      id: 2,
      name: "Wholesaler User",
      email: "wholesaler@productsphere.com",
      password: "wholesalerpassword",
      role: "wholesaler",
      phone: "03007654321",
      gender: "male",
      status: "approved",
      license_no: "TX-998827-B",
      business_address: "Karkhana Bazar, Faisalabad, Punjab"
    },
    {
      id: 3,
      name: "Buyer User",
      email: "buyer@productsphere.com",
      password: "buyerpassword",
      role: "buyer",
      phone: "03211234567",
      gender: "female",
      status: "approved",
      license_no: null,
      business_address: null
    }
  ];
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(seedUsers, null, 2));
}

// Mock database pool that intercepts simple SELECT, INSERT, UPDATE, and DELETE SQL queries
const db = {
  query: async (sql, params) => {
    try {
      const queryNormalized = sql.trim().toLowerCase();
      const isProductQuery = queryNormalized.includes('products');
      const dbPath = isProductQuery ? PRODUCTS_DB_PATH : JSON_DB_PATH;

      // Ensure products file exists if it was deleted or first run
      if (isProductQuery && !fs.existsSync(PRODUCTS_DB_PATH)) {
        fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify([], null, 2));
      }

      const data = fs.readFileSync(dbPath, 'utf8');
      const items = JSON.parse(data);

      if (queryNormalized.startsWith('select')) {
        if (isProductQuery) {
          // SELECT id, name, description, price, original_price, quantity, category, wholesaler_id, wholesaler_name, status FROM products
          return [items];
        } else {
          // Check if filtering by role and status (e.g. for pending approval list)
          if (queryNormalized.includes('role =') && queryNormalized.includes('status =')) {
            const roleParam = params[0].toLowerCase();
            const statusParam = params[1].toLowerCase();
            const matched = items.filter(u => 
              u.role.toLowerCase() === roleParam && 
              (u.status || 'approved').toLowerCase() === statusParam
            );
            return [matched];
          }

          // Example: SELECT id, name, email, password, role, phone, gender, status, license_no, business_address FROM users WHERE email = ?
          const emailParam = params[0].toLowerCase();
          const matchedUser = items.find(u => u.email.toLowerCase() === emailParam);
          return [matchedUser ? [matchedUser] : []];
        }
      } 
      
      if (queryNormalized.startsWith('insert')) {
        if (isProductQuery) {
          // Example: INSERT INTO products (name, description, price, original_price, quantity, category, wholesaler_id, wholesaler_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          const [name, description, price, original_price, quantity, category, wholesaler_id, wholesaler_name, status] = params;
          const newProduct = {
            id: items.length > 0 ? Math.max(...items.map(p => p.id)) + 1 : 1,
            name,
            description: description || null,
            price: Number(price),
            original_price: Number(original_price),
            quantity: Number(quantity || 1),
            category,
            wholesaler_id: Number(wholesaler_id),
            wholesaler_name,
            status: status || 'active'
          };
          items.push(newProduct);
          fs.writeFileSync(dbPath, JSON.stringify(items, null, 2));
          return [{ insertId: newProduct.id }];
        } else {
          // Example: INSERT INTO users (name, phone, gender, email, password, role, status, license_no, business_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          const [name, phone, gender, email, password, role, status, license_no, business_address] = params;
          const newUser = {
            id: items.length > 0 ? Math.max(...items.map(u => u.id)) + 1 : 1,
            name,
            phone: phone || null,
            gender: gender || 'male',
            email,
            password,
            role: role || 'buyer',
            status: status || (role === 'wholesaler' ? 'pending' : 'approved'),
            license_no: license_no || null,
            business_address: business_address || null
          };
          items.push(newUser);
          fs.writeFileSync(dbPath, JSON.stringify(items, null, 2));
          return [{ insertId: newUser.id }];
        }
      }

      if (queryNormalized.startsWith('update')) {
        if (isProductQuery) {
          // Example: UPDATE products SET status = ? WHERE id = ?
          const [status, id] = params;
          const idx = items.findIndex(p => p.id === parseInt(id));
          if (idx !== -1) {
            items[idx].status = status;
            fs.writeFileSync(dbPath, JSON.stringify(items, null, 2));
            return [{ affectedRows: 1 }];
          }
          return [{ affectedRows: 0 }];
        } else {
          // Example: UPDATE users SET status = ? WHERE id = ?
          const [status, id] = params;
          const userIndex = items.findIndex(u => u.id === parseInt(id));
          if (userIndex !== -1) {
            items[userIndex].status = status;
            fs.writeFileSync(dbPath, JSON.stringify(items, null, 2));
            return [{ affectedRows: 1 }];
          }
          return [{ affectedRows: 0 }];
        }
      }

      if (queryNormalized.startsWith('delete')) {
        if (isProductQuery) {
          // Example: DELETE FROM products WHERE id = ?
          const id = params[0];
          const filtered = items.filter(p => p.id !== parseInt(id));
          fs.writeFileSync(dbPath, JSON.stringify(filtered, null, 2));
          return [{ affectedRows: 1 }];
        }
      }

      return [[]];
    } catch (err) {
      console.error("Mock DB error:", err);
      throw err;
    }
  }
};

module.exports = db;
