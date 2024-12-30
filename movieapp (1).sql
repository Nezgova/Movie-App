-- Drop existing `favorites` table if it exists
DROP TABLE IF EXISTS `favorites`;

-- Drop existing `users` table if it exists
DROP TABLE IF EXISTS `users`;

-- Create the `users` table first
CREATE TABLE `users` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,  -- Ensure `id` is UNSIGNED and auto-increment
  `username` VARCHAR(255) CHARACTER SET utf8 NOT NULL,  -- Change to utf8 charset
  `email` VARCHAR(255) CHARACTER SET utf8 NOT NULL,  -- Change to utf8 charset
  `password` VARCHAR(255) NOT NULL,
  `sex` ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
  `profile_picture` VARCHAR(255) DEFAULT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `birthday` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),  -- `id` is the primary key
  UNIQUE KEY `email` (`email`)  -- Ensure unique email for each user
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Now create the `favorites` table
CREATE TABLE `favorites` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,  -- Added AUTO_INCREMENT for the `id` column
  `user_id` INT(11) UNSIGNED NOT NULL,  -- Ensure `user_id` is UNSIGNED and matches `users.id` type
  `content_id` VARCHAR(255) DEFAULT NULL,
  `media_type` ENUM('movie', 'tv') DEFAULT NULL,
  PRIMARY KEY (`id`),  -- Primary key constraint for `id`
  KEY `user_id` (`user_id`),  -- Index for `user_id`
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE  -- Ensure `user_id` references `users.id`
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

-- Insert initial data for `users`
INSERT INTO `users` (`username`, `email`, `password`, `sex`, `profile_picture`, `phone_number`, `birthday`, `created_at`) VALUES
('testuser', 'testuser@example.com', '$2b$10$t6Kik8iut3s42jl0r0aOFu2zQXeqQUMY28WKOSFs.qT.5.y/wWgMO', 'Other', NULL, NULL, NULL, '2024-12-29 16:40:20'),
('admin', 'admin@emsi.ma', '$2b$10$0T.fD9UwYYi3Ufda.jB5wuc/ku/Ru4Wf.TZCfe.Wg3QVEFqxbpO52', 'Other', NULL, NULL, NULL, '2024-12-29 16:40:20'),
('nezgova', 'nez@emsi.ma', '$2b$10$OXmAevxasRWW/cPVbBmgoe8CkVMk0DZN49xsoNtA8G.moUl0XgPIG', 'Other', '/uploads/profile_pictures/1735493557681.jpg', '+212682740674', '2004-05-12', '2024-12-29 16:40:20'),
('ilias', 'ilias@gmail.com', '$2b$10$z.avsfPmWDDV0C4yRmlEjeDgcGsXfphzaoMKVQhfWWb/ZehRDHcsG', 'Other', NULL, NULL, NULL, '2024-12-29 16:40:20'),
('adilB', 'adilB@emsi.ma', '$2b$10$BiXdI/Tp8s5QA8Ej7uhQpuTxLaLzEQ8dBe3zQhg6VWRZRoIyA3G2G', 'Other', '/uploads/profile_pictures/1735494688278.jpeg', NULL, NULL, '2024-12-29 16:40:20'),
('mounda', 'mouna@emsi.ma', '$2b$10$UzlflXCc/xvlQg4VSdzdIOkQJ2nBsU98sxVZ41T8.e9cPqmhw4vaa', 'Other', NULL, NULL, NULL, '2024-12-29 16:40:20'),
('zouhair', 'zouhair@negro.com', '$2b$10$RsWclFEgLqMYPp4ah2bHd.Ztu25rcHAQAssVq2PXCWhTc/90i9T1y', 'Other', NULL, NULL, NULL, '2024-12-29 16:40:20'),
('tester', 'tester@emsi.ma', '$2b$10$lNzTUO2KOvcgxU9aw98nbuP0b5IjmJ2e4XcohsxE82o70pdyOrbkm', 'Other', NULL, NULL, NULL, '2024-12-29 16:40:20');

-- Insert initial data for `favorites`
INSERT INTO `favorites` (`user_id`, `content_id`, `media_type`) VALUES
(5, '839033', 'movie'),
(5, '93405', 'tv'),
(5, '974453', 'movie'),
(5, '1399', 'tv'),
(5, '30984', 'tv'),
(7, '429', 'movie');

-- --------------------------------------------------------

-- Auto-increment values for `favorites` and `users`
ALTER TABLE `favorites`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `users`
  MODIFY `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

COMMIT;
