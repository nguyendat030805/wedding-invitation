import { getWishes } from "../actions";
import MainContent from "@/src/components/MainContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SGon() {
  const wishes = await getWishes();

  return (
    <main className="min-h-screen bg-white relative overflow-hidden selection:bg-red-200">
      <MainContent
        initialWishes={wishes}
        type="guest" // Mặc định hiển thị thông tin chung hoặc tùy chỉnh cho tiệc Sài Gòn
      />
    </main>
  );
}