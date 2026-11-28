SELECT r.name, COUNT(u.id) AS user_count
FROM roles r
LEFT JOIN users u ON u.roleId = r.id
GROUP BY r.id, r.name;
