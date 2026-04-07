import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Search, Users, GraduationCap, Loader2, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";

type User = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: number;
  created_at: string;
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"student" | "researcher">("student");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3600/api/users");
      if (res.ok) setUsers(await res.json());
      else toast.error("Failed to load users");
    } catch { toast.error("Could not connect to server"); }
    finally { setLoading(false); }
  };

  const handleToggleActive = async (user: User) => {
    setProcessingId(user.user_id);
    const newStatus = user.is_active ? 0 : 1;
    try {
      const res = await fetch(`http://localhost:3600/api/users/${user.user_id}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      setUsers(prev => prev.map(u => u.user_id === user.user_id ? { ...u, is_active: newStatus } : u));
      toast.success(`Account ${newStatus ? "enabled" : "disabled"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally { setProcessingId(null); }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Delete ${user.first_name} ${user.last_name}?`)) return;
    setProcessingId(user.user_id);
    try {
      const res = await fetch(`http://localhost:3600/api/users/${user.user_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(prev => prev.filter(u => u.user_id !== user.user_id));
      toast.success("User deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally { setProcessingId(null); }
  };

  const filteredUsers = users.filter(u =>
    u.role === activeTab &&
    (`${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const studentCount = users.filter(u => u.role === "student").length;
  const raCount = users.filter(u => u.role === "researcher").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">User Management</h1>
              <p className="text-blue-200 text-sm">{studentCount} students · {raCount} researchers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("student")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              backgroundColor: activeTab === "student" ? '#003580' : 'white',
              color: activeTab === "student" ? 'white' : '#6B7280',
              boxShadow: activeTab === "student" ? '0 2px 8px rgba(0,53,128,0.3)' : 'none',
              border: activeTab !== "student" ? '1px solid #E5E7EB' : 'none',
            }}
          >
            <GraduationCap className="w-4 h-4" />
            Students ({studentCount})
          </button>
          <button
            onClick={() => setActiveTab("researcher")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              backgroundColor: activeTab === "researcher" ? '#003580' : 'white',
              color: activeTab === "researcher" ? 'white' : '#6B7280',
              boxShadow: activeTab === "researcher" ? '0 2px 8px rgba(0,53,128,0.3)' : 'none',
              border: activeTab !== "researcher" ? '1px solid #E5E7EB' : 'none',
            }}
          >
            <Users className="w-4 h-4" />
            Researchers ({raCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all"
          />
        </div>

        {/* Users List */}
        <Card className="border-0 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#003580' }} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#C0C0C0' }} />
              <p className="font-semibold text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <div key={user.user_id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: '#003580' }}>
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-300 mt-0.5">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.is_active ? 'Active' : 'Disabled'}
                    </span>
                    <button
                      disabled={processingId === user.user_id}
                      onClick={() => handleToggleActive(user)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                      style={{
                        borderColor: user.is_active ? '#FCA5A5' : '#86EFAC',
                        color: user.is_active ? '#DC2626' : '#16A34A',
                        backgroundColor: user.is_active ? '#FEF2F2' : '#F0FDF4',
                      }}
                    >
                      {processingId === user.user_id ? '...' : user.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      disabled={processingId === user.user_id}
                      onClick={() => handleDelete(user)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}