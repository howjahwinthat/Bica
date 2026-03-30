import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft } from "lucide-react";
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

export function StudyRules() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedStudy, setSelectedStudy] = useState("1");
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      name: "Minimum Age Requirement",
      type: "eligibility",
      enabled: true,
      value: "18",
    },
    {
      id: "2",
      name: "Maximum Participants Per Session",
      type: "scheduling",
      enabled: true,
      value: "10",
    },
  ]);

  const [newRule, setNewRule] = useState({
    name: "",
    type: "eligibility" as Rule["type"],
    value: "",
  });

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
    toast.success("Rule deleted");
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.value) {
      toast.error("Please fill in all fields");
      return;
    }

    const rule: Rule = {
      id: Date.now().toString(),
      ...newRule,
      enabled: true,
    };

    setRules([...rules, rule]);
    setNewRule({ name: "", type: "eligibility", value: "" });
    toast.success("Rule added successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate(user?.role === "researcher" ? "/ra/dashboard" : "/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Study-Specific Rules</h1>

          <div className="mb-6">
            <Label htmlFor="selectStudy">Select Study</Label>
            <select
              id="selectStudy"
              value={selectedStudy}
              onChange={(e) => setSelectedStudy(e.target.value)}
              className="block w-full mt-1 p-2 border rounded"
            >
              {mockStudies.map((study) => (
                <option key={study.id} value={study.id}>
                  {study.name}
                </option>
              ))}
            </select>
          </div>

          <hr className="my-6" />

          <h2 className="text-xl mb-4">Add New Rule</h2>
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                placeholder="e.g., GPA Requirement"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="ruleType">Rule Type</Label>
              <select
                id="ruleType"
                value={newRule.type}
                onChange={(e) => setNewRule({ ...newRule, type: e.target.value as Rule["type"] })}
                className="block w-full mt-1 p-2 border rounded"
              >
                <option value="eligibility">Eligibility</option>
                <option value="scheduling">Scheduling</option>
                <option value="participation">Participation</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <div>
              <Label htmlFor="ruleValue">Value</Label>
              <Input
                id="ruleValue"
                placeholder="e.g., 3.0"
                value={newRule.value}
                onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
              />
            </div>

            <Button onClick={handleAddRule} className="w-full">
              Add Rule
            </Button>
          </div>

          <hr className="my-6" />

          <h2 className="text-xl mb-4">Active Rules ({rules.length})</h2>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="border p-4 rounded flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant="outline">{rule.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Value: <span className="font-medium">{rule.value}</span>
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteRule(rule.id)}
                >
                  Delete
                </Button>
              </div>
            ))}

            {rules.length === 0 && (
              <p className="text-gray-600 text-center py-12">
                No rules configured for this study
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}