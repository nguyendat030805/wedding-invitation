import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql-3048986d-datnguyen-wedding.h.aivencloud.com',
  user: process.env.MYSQL_USER || 'avnadmin',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'defaultdb',
  port: Number(process.env.MYSQL_PORT) || 23545,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Thêm dòng này vì hầu hết các host MySQL online đều yêu cầu SSL mã hóa bảo mật
  ssl: {
    rejectUnauthorized: false // Giúp Vercel kết nối mượt mà không bị bắt bẻ chứng chỉ cục bộ
  }
});