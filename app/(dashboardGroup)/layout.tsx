export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 
        This is a simple wrapper for dashboards. 
        In actual deployment, you might wrap this with a DashboardSidebar or role checks.
      */}
      {children}
    </div>
  );
}