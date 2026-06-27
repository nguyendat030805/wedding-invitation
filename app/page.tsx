import { getWishes } from './actions';
export const dynamic = 'force-dynamic';
import MainContent from '@/src/components/MainContent';

export const revalidate = 0; // Đảm bảo dữ liệu luôn được làm mới liên tục

export default async function Home() {
  const wishes = await getWishes();

  return (
    <main className="min-h-screen bg-white relative overflow-hidden selection:bg-red-200">
      <MainContent initialWishes={wishes} />
    </main>
  );
}