import mysql from 'mysql2/promise';

// Khởi tạo Connection Pool giúp tối ưu kết nối, tránh tràn cổng kết nối
export const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Nguyendat@123', // Viết mật khẩu gốc bình thường, KHÔNG cần mã hóa %40
  database: 'wedding_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});