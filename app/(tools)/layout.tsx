import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-slate-900/50">
          {children}
        </main>
      </div>
    </div>
  );
}
