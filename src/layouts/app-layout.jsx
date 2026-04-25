import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="grid-background"></div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <main className="container relative min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Header />
        <Outlet />
      </main>
      <div className="border-t border-white/10 bg-slate-950/90 px-6 py-10 text-center text-sm text-slate-400">
        JobVerse for modern hiring teams and ambitious candidates.
      </div>
    </div>
  );
};

export default AppLayout;
