import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // Cấu hình chí mạng để giải quyết ETIMEDOUT trên Aiven:
  ssl: {
    rejectUnauthorized: false // Bỏ qua việc xác thực chứng chỉ cục bộ, giúp kết nối thông suốt lập tức
  },
  
  // Thêm thời gian chờ kết nối dài hơn để tránh bị ngắt quá sớm
  connectTimeout: 20000 
});