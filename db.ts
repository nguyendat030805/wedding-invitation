import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Nguyendat@123', 
  database: process.env.MYSQL_DATABASE || 'wedding_db',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Thêm dòng này vì hầu hết các host MySQL online đều yêu cầu SSL mã hóa bảo mật
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined
});