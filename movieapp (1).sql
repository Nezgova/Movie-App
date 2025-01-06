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

-- --------------------------------------------------------

-- Auto-increment values for `favorites` and `users`
ALTER TABLE `favorites`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `users`
  MODIFY `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

COMMIT;
