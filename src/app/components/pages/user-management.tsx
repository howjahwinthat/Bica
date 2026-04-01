import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Search } from "lucide-react";
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
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"student" | "researcher">("student");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3600/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error("Failed to load users");
      }
    } catch (err) {
      toast.error("Could not connect to server");
    } finally {
      setLoading(false);
    }
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
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id ? { ...u, is_active: newStatus } : u
        )
      );
      toast.success(`Account ${newStatus ? "enabled" : "disabled"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) return;
    setProcessingId(user.user_id);
    try {
      const res = await fetch(`http://localhost:3600/api/users/${user.user_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
      toast.success("User deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = u.role === activeTab;
    const matchesSearch =
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const studentCount = users.filter((u) => u.role === "student").length;
  const raCount = users.filter((u) => u.role === "researcher").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">User Management</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("student")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Students ({studentCount})
            </button>
            <button
              onClick={() => setActiveTab("researcher")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "researcher"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Research Assistants ({raCount})
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 p-2 border rounded"
            />
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No users found.</p>
          ) : (
            <div className="divide-y">
              {filteredUsers.map((user) => (
                <div key={user.user_id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        user.is_active
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }
                      variant="outline"
                    >
                      {user.is_active ? "Active" : "Disabled"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingId === user.user_id}
                      onClick={() => handleToggleActive(user)}
                      className={user.is_active ? "border-red-300 text-red-600 hover:bg-red-50" : "border-green-300 text-green-600 hover:bg-green-50"}
                    >
                      {processingId === user.user_id ? "..." : user.is_active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={processingId === user.user_id}
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
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