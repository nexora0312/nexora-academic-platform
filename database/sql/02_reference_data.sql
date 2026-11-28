INSERT IGNORE INTO roles (id, name) VALUES
  (UUID(), 'SUPER_ADMIN'),
  (UUID(), 'ADMIN'),
  (UUID(), 'HOD'),
  (UUID(), 'LECTURER'),
  (UUID(), 'ACADEMIC_OFFICER'),
  (UUID(), 'STUDENT');
