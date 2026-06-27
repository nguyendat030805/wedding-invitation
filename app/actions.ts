'use server';

import { pool } from '../db'; // Import cấu hình mysql2
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
    // Câu lệnh SQL thuần để thêm lời chúc vào bảng Wish (trường cmt và like để trống tự nhận mặc định trong DB)
    const sql = 'INSERT INTO wish (name, relationship, content) VALUES (?, ?, ?)';
    await pool.execute(sql, [name, relationship, content]);
    
    // Ép Next.js xóa cache trang chủ để cập nhật lời chúc mới ngay lập tức
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Lỗi Database:', error instanceof Error ? error.message : error, error);
    return { success: false, error: 'Không thể gửi lời chúc. Vui lòng thử lại!' };
  }
}

// Hàm lấy danh sách lời chúc (Hiển thị ra giao diện)
export async function getWishes() {
  try {
    // Câu lệnh SQL lấy toàn bộ lời chúc, bao gồm cả trường comment và likes
    const [rows] = await pool.execute('SELECT * FROM wish ORDER BY createdAt DESC');
    return rows as any[];
  } catch (error) {
    console.error('Lỗi Fetch dữ liệu:', error);
    return [];
  }
}

// BỔ SUNG HÀM THẢ TIM XUỐNG DATABASE MYSQL
export async function likeWish(wishId: number) {
  try {
    const sql = 'UPDATE wish SET likes = COALESCE(likes, 0) + 1 WHERE id = ?';
    await pool.execute(sql, [wishId]);
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi tăng tim DB:', error);
    return { success: false, error: 'Không thể thả tim.' };
  }
}

// Hàm dành riêng cho Cô dâu / Chú rể rep cmt của khách
export async function replyWish(wishId: number, replyContent: string, adminPin: string) {
  // Kiểm tra mã PIN bảo mật để tránh người lạ hack gửi bậy
  if (adminPin !== "2107") { 
    return { success: false, error: 'Mã xác thực dâu rể không chính xác!' };
  }

  try {
    const sql = 'UPDATE wish SET comment = ? WHERE id = ?';
    await pool.execute(sql, [replyContent, wishId]);
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi rep comment:', error);
    return { success: false, error: 'Không thể gửi phản hồi.' };
  }
}