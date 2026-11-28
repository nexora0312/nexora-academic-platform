CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  expiresAt DATETIME(3) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_sessions_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_user (userId),
  INDEX idx_sessions_expires (expiresAt)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  tokenHash CHAR(64) NOT NULL UNIQUE,
  expiresAt DATETIME(3) NOT NULL,
  usedAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_password_reset_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_password_reset_user (userId),
  INDEX idx_password_reset_expires (expiresAt)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
