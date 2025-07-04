import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState({
    users: "-",
    forms: "-",
    submissions: "-",
    pending: "-"
  });

  useEffect(() => {
    if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.push("/unauthorized");
    }
  }, [session, status]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, formsRes, entriesRes, pendingRes] = await Promise.all([
          fetch("http://localhost:5000/api/stats/users"),
          fetch("http://localhost:5000/api/stats/forms"),
          fetch("http://localhost:5000/api/stats/entries"),
          fetch("http://localhost:5000/api/stats/pending-reviews"),
        ]);

        const users = await usersRes.json();
        const forms = await formsRes.json();
        const entries = await entriesRes.json();
        const pending = await pendingRes.json();

        setStats({
          users: users.totalUsers,
          forms: forms.totalForms,
          submissions: entries.totalEntries,
          pending: pending.pendingReviews
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

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
        <DashboardCard title="Total Users" value={stats.users} />
        <DashboardCard title="Active Forms" value={stats.forms} />
        <DashboardCard title="Submissions" value={stats.submissions} />
        <DashboardCard title="Pending Reviews" value={stats.pending} />
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

function DashboardCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
