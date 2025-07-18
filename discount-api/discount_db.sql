-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 18, 2025 at 03:20 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `discount_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int NOT NULL,
  `voucher_code` varchar(255) NOT NULL,
  `discount_percent` int NOT NULL,
  `expiry_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `voucher_code`, `discount_percent`, `expiry_date`, `created_at`, `updated_at`) VALUES
(2, 'V0101', 9, '2025-07-17 17:00:00', '2025-07-18 06:06:54', '2025-07-18 06:39:51'),
(5, 'V0102', 4, '2025-07-17 17:00:00', '2025-07-18 06:14:19', '2025-07-18 06:14:19'),
(7, 'ABFKAFBKB', 9, '2025-07-11 17:00:00', '2025-07-18 06:14:36', '2025-07-18 06:14:36'),
(8, 'KAFBAKBAKJFABKJ', 9, '2025-07-11 17:00:00', '2025-07-18 06:14:49', '2025-07-18 06:14:49'),
(9, 'CMAMCOAMO', 1, '2025-07-07 17:00:00', '2025-07-18 06:14:57', '2025-07-18 06:14:57'),
(10, 'ISINISNFISFN', 8, '2025-07-22 17:00:00', '2025-07-18 06:15:26', '2025-07-18 06:15:26'),
(11, 'OOAKAK', 1, '2025-07-11 17:00:00', '2025-07-18 06:15:42', '2025-07-18 06:15:42'),
(12, 'V0103', 8, '2025-07-09 17:00:00', '2025-07-18 06:22:52', '2025-07-18 06:22:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `voucher_code` (`voucher_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
