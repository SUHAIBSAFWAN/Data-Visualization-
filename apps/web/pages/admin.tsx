import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.push("/unauthorized");
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <button
        onClick={() => signOut()}
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Users" value="34" />
        <DashboardCard title="Active Forms" value="5" />
        <DashboardCard title="Submissions" value="243" />
        <DashboardCard title="Pending Reviews" value="12" />
      </div>

      {/* Quick Links */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
        <ul className="list-disc pl-5 text-blue-600 space-y-1">
          <li><a href="/form-builder">🧾 Create New Form</a></li>
          <li><a href="/form-list">📁 View All Forms</a></li>
          <li><a href="/user-management">👥 Manage Users</a></li>
          <li><a href="/reports">📊 View Reports</a></li>
        </ul>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
