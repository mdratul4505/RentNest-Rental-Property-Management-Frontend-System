export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 
        This is a simple wrapper for dashboards. 
        In actual deployment, you might wrap this with a DashboardSidebar or role checks.
      */}
      {children}
    </div>
  );
}