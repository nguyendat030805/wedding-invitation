'use server';

import { pool } from '../db'; // Import cấu hình mysql2 vừa tạo
import { revalidatePath } from 'next/cache';

// Hàm gửi lời chúc mới (Lưu vào MySQL)
export async function submitWish(formData: FormData) {
  const name = formData.get('name') as string;
  const relationship = formData.get('relationship') as string;
  const content = formData.get('content') as string;

  if (!name || !relationship || !content) {
    return { success: false, error: 'Vui lòng điền đầy đủ thông tin bạn nhé!' };
  }

  try {
    // Câu lệnh SQL thuần để thêm lời chúc vào bảng Wish
    const sql = 'INSERT INTO Wish (name, relationship, content) VALUES (?, ?, ?)';
    await pool.execute(sql, [name, relationship, content]);
    
    // Ép Next.js xóa cache trang chủ để cập nhật lời chúc mới ngay lập tức
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Lỗi Database:', error);
    return { success: false, error: 'Không thể gửi lời chúc. Vui lòng thử lại!' };
  }
}

// Hàm lấy danh sách lời chúc (Hiển thị ra giao diện)
export async function getWishes() {
  try {
    // Câu lệnh SQL lấy toàn bộ lời chúc, xếp người mới chúc lên đầu
    const [rows] = await pool.execute('SELECT * FROM Wish ORDER BY createdAt DESC');
    return rows as any[];
  } catch (error) {
    console.error('Lỗi Fetch dữ liệu:', error);
    return [];
  }
}