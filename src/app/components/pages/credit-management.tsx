// Responsible Party: Brooke
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, Send, Edit, CheckCircle } from "lucide-react";
import { toast } from "sonner";

type CreditRecord = {
  id: string;
  studentName: string;
  studentEmail: string;
  studyName: string;
  sessionId: string;
  date: string;
  creditAmount: number;
  status: "pending" | "assigned" | "adjusted" | "notified";
  assignmentType: "automatic" | "manual";
  notes: string;
  attendanceStatus: "present" | "absent" | "no-show";
};

const mockRecords: CreditRecord[] = [
  {
    id: "1",
    studentName: "John Smith",
    studentEmail: "john@example.com",
    studyName: "Cognitive Psychology Study 2026",
    sessionId: "SESS-2026-001",
    date: "2026-03-15",
    creditAmount: 1.0,
    status: "assigned",
    assignmentType: "automatic",
    notes: "",
    attendanceStatus: "present",
  },
  {
    id: "2",
    studentName: "Jane Doe",
    studentEmail: "jane@example.com",
    studyName: "Social Behavior Research",
    sessionId: "SESS-2026-002",
    date: "2026-03-16",
    creditAmount: 1.5,
    status: "pending",
    assignmentType: "automatic",
    notes: "",
    attendanceStatus: "present",
  },
  {
    id: "3",
    studentName: "Bob Johnson",
    studentEmail: "bob@example.com",
    studyName: "Memory Retention Experiment",
    sessionId: "SESS-2026-003",
    date: "2026-03-14",
    creditAmount: 0.0,
    status: "pending",
    assignmentType: "automatic",
    notes: "No show - needs manual review",
    attendanceStatus: "no-show",
  },
];

export function CreditManagement() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(mockRecords);
  const [selectedRecord, setSelectedRecord] = useState<CreditRecord | null>(null);
  const [adjustedCredit, setAdjustedCredit] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [autoAssign, setAutoAssign] = useState(true);

  const handleAssignCredit = (recordId: string, amount: number, type: "automatic" | "manual") => {
    setRecords(
      records.map((record) =>
        record.id === recordId
          ? { ...record, creditAmount: amount, status: "assigned" as const, assignmentType: type }
          : record
      )
    );
    toast.success(`Credit ${type === "automatic" ? "automatically" : "manually"} assigned: ${amount} credits`);
  };

  const handleAdjustCredit = () => {
    if (!selectedRecord || !adjustedCredit) {
      toast.error("Please enter a credit amount");
      return;
    }

    const amount = parseFloat(adjustedCredit);
    setRecords(
      records.map((record) =>
        record.id === selectedRecord.id
          ? { ...record, creditAmount: amount, status: "adjusted" as const, assignmentType: "manual" }
          : record
      )
    );

    if (selectedRecord) {
      setSelectedRecord({
        ...selectedRecord,
        creditAmount: amount,
        status: "adjusted",
        assignmentType: "manual",
      });
    }

    setAdjustedCredit("");
    toast.success(`Credit adjusted to ${amount}`);
  };

  const handleNotifyStudent = () => {
    if (!selectedRecord) return;

    setRecords(
      records.map((record) =>
        record.id === selectedRecord.id ? { ...record, status: "notified" as const } : record
      )
    );

    if (selectedRecord) {
      setSelectedRecord({ ...selectedRecord, status: "notified" });
    }

    toast.success(`Notification sent to ${selectedRecord.studentEmail}`);
    setNotificationMessage("");
  };

  const handleNoShow = (recordId: string) => {
    setRecords(
      records.map((record) =>
        record.id === recordId
          ? { ...record, creditAmount: 0, status: "assigned" as const, attendanceStatus: "no-show" as const }
          : record
      )
    );
    toast.success("No-show recorded. Credit set to 0.");
  };

  const handleBulkAutoAssign = () => {
    const updated = records.map((record) => {
      if (record.status === "pending" && record.attendanceStatus === "present") {
        return { ...record, status: "assigned" as const, assignmentType: "automatic" as const };
      }
      return record;
    });
    setRecords(updated);
    toast.success("Credits automatically assigned to all eligible participants");
  };

  const getStatusBadge = (status: CreditRecord["status"]) => {
    switch (status) {
      case "assigned":
        return <Badge className="bg-green-100 text-green-700">Assigned</Badge>;
      case "adjusted":
        return <Badge className="bg-blue-100 text-blue-700">Adjusted</Badge>;
      case "notified":
        return <Badge className="bg-purple-100 text-purple-700">Notified</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Credit Management</h1>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoAssign}
                  onChange={(e) => setAutoAssign(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Auto-assign on attendance</span>
              </label>
              <Button onClick={handleBulkAutoAssign}>
                <CheckCircle size={16} className="mr-2" />
                Bulk Auto-Assign
              </Button>
            </div>
          </div>

          {!selectedRecord ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border p-4 rounded">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{record.studentName}</h3>
                      <p className="text-sm text-gray-600">{record.studentEmail}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {record.studyName} • {record.sessionId}
                      </p>
                      <p className="text-sm text-gray-600">{record.date}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(record.status)}
                      <p className="text-sm text-gray-600 mt-1">
                        Credits: <strong>{record.creditAmount}</strong>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {record.assignmentType === "automatic" ? "Auto" : "Manual"}
                      </p>
                    </div>
                  </div>

                  {record.attendanceStatus === "no-show" && (
                    <div className="bg-red-50 border border-red-200 p-2 rounded mb-3">
                      <p className="text-sm text-red-700">⚠️ No Show - No credit assigned</p>
                    </div>
                  )}

                  {record.notes && (
                    <p className="text-sm text-gray-600 mb-3 italic">{record.notes}</p>
                  )}

                  <div className="flex gap-2">
                    {record.status === "pending" && record.attendanceStatus === "present" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAssignCredit(record.id, record.creditAmount, "automatic")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Auto-Assign Credit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRecord(record)}
                        >
                          Manual Assignment
                        </Button>
                      </>
                    )}
                    {record.status !== "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => setSelectedRecord(record)}>
                          <Edit size={14} className="mr-1" />
                          Adjust Credit
                        </Button>
                        <Button size="sm" onClick={() => setSelectedRecord(record)}>
                          <Send size={14} className="mr-1" />
                          Notify Student
                        </Button>
                      </>
                    )}
                    {record.attendanceStatus === "present" && record.status === "pending" && (
                      <Button size="sm" variant="destructive" onClick={() => handleNoShow(record.id)}>
                        Mark No Show
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Button variant="outline" onClick={() => setSelectedRecord(null)} className="mb-6">
                ← Back to List
              </Button>

              <div className="border p-4 rounded mb-6 bg-gray-50">
                <h3 className="font-semibold mb-2">{selectedRecord.studentName}</h3>
                <p className="text-sm text-gray-600">{selectedRecord.studentEmail}</p>
                <p className="text-sm text-gray-600">
                  {selectedRecord.studyName} • {selectedRecord.sessionId}
                </p>
                <p className="text-sm text-gray-600">{selectedRecord.date}</p>
                <div className="mt-2">
                  {getStatusBadge(selectedRecord.status)}
                </div>
              </div>

              <div className="space-y-6">
                {/* Adjust Credit */}
                <div className="border p-4 rounded">
                  <h3 className="font-semibold mb-4">Adjust Credit Amount</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="currentCredit">Current Credit</Label>
                      <Input
                        id="currentCredit"
                        value={selectedRecord.creditAmount}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adjustedCredit">New Credit Amount</Label>
                      <Input
                        id="adjustedCredit"
                        type="number"
                        step="0.5"
                        placeholder="Enter new credit amount"
                        value={adjustedCredit}
                        onChange={(e) => setAdjustedCredit(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAdjustCredit} className="w-full">
                      <Edit size={16} className="mr-2" />
                      Update Credit
                    </Button>
                  </div>
                </div>

                {/* Notify Student */}
                <div className="border p-4 rounded">
                  <h3 className="font-semibold mb-4">Send Credit Notification</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="notificationMessage">Message to Student</Label>
                      <Textarea
                        id="notificationMessage"
                        rows={4}
                        placeholder={`Hi ${selectedRecord.studentName},\n\nYou have been awarded ${selectedRecord.creditAmount} credit(s) for participating in ${selectedRecord.studyName}.\n\nThank you for your participation!`}
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleNotifyStudent} className="w-full bg-purple-600 hover:bg-purple-700">
                      <Send size={16} className="mr-2" />
                      Send Notification
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

