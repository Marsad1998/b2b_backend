-- Product Sphere B2B Local Market Database Schema
-- SQL File for importing into MySQL (via phpMyAdmin or Command Line)

CREATE DATABASE IF NOT EXISTS `product_sphere_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `product_sphere_db`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL COMMENT 'admin, buyer, wholesaler',
  `phone` VARCHAR(50) DEFAULT NULL,
  `gender` VARCHAR(50) DEFAULT 'male',
  `status` VARCHAR(50) DEFAULT 'approved' COMMENT 'approved, pending, rejected',
  `license_no` VARCHAR(100) DEFAULT NULL,
  `business_address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Dumping data for table `users`
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `gender`, `status`, `license_no`, `business_address`) VALUES
(1, 'System Admin', 'admin@productsphere.com', 'adminpassword', 'admin', '03001234567', 'male', 'approved', NULL, NULL),
(2, 'Wholesaler User', 'wholesaler@productsphere.com', 'wholesalerpassword', 'wholesaler', '03007654321', 'male', 'approved', 'TX-998827-B', 'Karkhana Bazar, Faisalabad, Punjab'),
(3, 'Buyer User', 'buyer@productsphere.com', 'buyerpassword', 'buyer', '03211234567', 'female', 'approved', NULL, NULL)
ON DUPLICATE KEY UPDATE id=id;

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) NOT NULL,
  `quantity` INT DEFAULT 1,
  `category` VARCHAR(100) NOT NULL,
  `wholesaler_id` INT NOT NULL,
  `wholesaler_name` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`wholesaler_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Dumping data for table `products`
-- --------------------------------------------------------

INSERT INTO `products` (`id`, `name`, `description`, `price`, `original_price`, `quantity`, `category`, `wholesaler_id`, `wholesaler_name`, `status`) VALUES
(1, 'Bulk Summer T-Shirts (Lot of 100)', '100% organic cotton summer t-shirts in bulk. Assorted sizes and vibrant colors.', 15000.00, 25000.00, 100, 'Clothing', 2, 'Wholesaler User', 'active'),
(2, 'Premium Leather Sports Shoes (50 Pairs)', 'High durability premium sports shoes, perfect for running and outdoor sports.', 40000.00, 60000.00, 50, 'Shoes', 2, 'Wholesaler User', 'active'),
(3, 'Natural Rose Perfume Pack (30 Bottles)', 'Organic sweet rose scent perfume bottles. Premium packaging for gift shops.', 12000.00, 18000.00, 30, 'Perfumes', 2, 'Wholesaler User', 'active')
ON DUPLICATE KEY UPDATE id=id;
