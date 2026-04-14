import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Settings, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

type Rule = {
  id: string;
  name: string;
  type: "eligibility" | "scheduling" | "participation" | "credit";
  enabled: boolean;
  value: string;
};

const mockStudies = [
  { id: "1", name: "Cognitive Psychology Study 2026" },
  { id: "2", name: "Social Behavior Research" },
  { id: "3", name: "Memory Retention Experiment" },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  eligibility: { bg: '#EBF0FA', text: '#003580' },
  scheduling: { bg: '#F0FDF4', text: '#166534' },
  participation: { bg: '#FEF3C7', text: '#92400E' },
  credit: { bg: '#F3E8FF', text: '#6B21A8' },
};

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all";
const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

export function StudyRules() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedStudy, setSelectedStudy] = useState("1");
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", name: "Minimum Age Requirement", type: "eligibility", enabled: true, value: "18" },
    { id: "2", name: "Maximum Participants Per Session", type: "scheduling", enabled: true, value: "10" },
  ]);
  const [newRule, setNewRule] = useState({ name: "", type: "eligibility" as Rule["type"], value: "" });

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    toast.success("Rule deleted");
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.value) { toast.error("Please fill in all fields"); return; }
    setRules([...rules, { id: Date.now().toString(), ...newRule, enabled: true }]);
    setNewRule({ name: "", type: "eligibility", value: "" });
    toast.success("Rule added successfully");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Study Rules</h1>
            <p className="text-blue-200 text-sm">Configure eligibility and scheduling rules per study</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        {/* Study Selector */}
        <Card className="p-6 border-0 shadow-sm">
          <label className={labelClass}>Select Study</label>
          <select value={selectedStudy} onChange={e => setSelectedStudy(e.target.value)} className={inputClass}>
            {mockStudies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Card>

        {/* Add Rule */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Add New Rule</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelClass}>Rule Name</label>
              <input placeholder="e.g. GPA Requirement" value={newRule.name}
                onChange={e => setNewRule({ ...newRule, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Rule Type</label>
              <select value={newRule.type} onChange={e => setNewRule({ ...newRule, type: e.target.value as Rule["type"] })} className={inputClass}>
                <option value="eligibility">Eligibility</option>
                <option value="scheduling">Scheduling</option>
                <option value="participation">Participation</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Value</label>
              <input placeholder="e.g. 3.0" value={newRule.value}
                onChange={e => setNewRule({ ...newRule, value: e.target.value })} className={inputClass} />
            </div>
          </div>
          <button onClick={handleAddRule}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#003580' }}>
            <Plus className="w-4 h-4" /> Add Rule
          </button>
        </Card>

        {/* Rules List */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#003580' }}>Active Rules ({rules.length})</h2>
          {rules.length === 0 ? (
            <div className="text-center py-10">
              <Settings className="w-10 h-10 mx-auto mb-3" style={{ color: '#C0C0C0' }} />
              <p className="text-gray-400">No rules configured for this study.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#F4F6F9' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: typeColors[rule.type]?.bg, color: typeColors[rule.type]?.text }}>
                      {rule.type}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{rule.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Value: {rule.value}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}