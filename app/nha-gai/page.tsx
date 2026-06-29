import { getWishes } from "../actions";
import MainContent from "@/src/components/MainContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NhaGai() {
  const wishes = await getWishes();

  return (
    <main className="min-h-screen bg-white relative overflow-hidden selection:bg-red-200">
      <MainContent
        initialWishes={wishes}
        type="bride" // Mặc định hiển thị thông tin nhà gái
      />
    </main>
  );
}