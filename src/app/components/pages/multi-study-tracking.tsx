// Responisble Party: Brooke
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ArrowLeft, Search, TrendingUp } from "lucide-react";

type StudyCompletion = {
  studyName: string;
  sessionId: string;
  date: string;
  creditsEarned: number;
  status: "completed" | "no-show" | "in-progress";
};

type Student = {
  id: string;
  name: string;
  email: string;
  department: string;
  totalCredits: number;
  requiredCredits: number;
  studiesCompleted: number;
  completions: StudyCompletion[];
};

const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    department: "Psychology",
    totalCredits: 3.5,
    requiredCredits: 5.0,
    studiesCompleted: 3,
    completions: [
      {
        studyName: "Cognitive Psychology Study 2026",
        sessionId: "SESS-2026-001",
        date: "2026-03-15",
        creditsEarned: 1.0,
        status: "completed",
      },
      {
        studyName: "Social Behavior Research",
        sessionId: "SESS-2026-002",
        date: "2026-03-16",
        creditsEarned: 1.5,
        status: "completed",
      },
      {
        studyName: "Memory Retention Experiment",
        sessionId: "SESS-2026-003",
        date: "2026-03-17",
        creditsEarned: 1.0,
        status: "completed",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    department: "Sociology",
    totalCredits: 2.0,
    requiredCredits: 5.0,
    studiesCompleted: 2,
    completions: [
      {
        studyName: "Social Behavior Research",
        sessionId: "SESS-2026-004",
        date: "2026-03-18",
        creditsEarned: 1.5,
        status: "completed",
      },
      {
        studyName: "Decision Making Study",
        sessionId: "SESS-2026-005",
        date: "2026-03-19",
        creditsEarned: 0.5,
        status: "completed",
      },
    ],
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    department: "Psychology",
    totalCredits: 5.0,
    requiredCredits: 5.0,
    studiesCompleted: 5,
    completions: [
      {
        studyName: "Cognitive Psychology Study 2026",
        sessionId: "SESS-2026-006",
        date: "2026-03-10",
        creditsEarned: 1.0,
        status: "completed",
      },
      {
        studyName: "Memory Retention Experiment",
        sessionId: "SESS-2026-007",
        date: "2026-03-11",
        creditsEarned: 1.0,
        status: "completed",
      },
      {
        studyName: "Language Processing Study",
        sessionId: "SESS-2026-008",
        date: "2026-03-12",
        creditsEarned: 1.0,
        status: "completed",
      },
      {
        studyName: "Social Behavior Research",
        sessionId: "SESS-2026-009",
        date: "2026-03-13",
        creditsEarned: 1.5,
        status: "completed",
      },
      {
        studyName: "Decision Making Study",
        sessionId: "SESS-2026-010",
        date: "2026-03-14",
        creditsEarned: 0.5,
        status: "completed",
      },
    ],
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    department: "Business",
    totalCredits: 0.5,
    requiredCredits: 5.0,
    studiesCompleted: 1,
    completions: [
      {
        studyName: "Decision Making Study",
        sessionId: "SESS-2026-011",
        date: "2026-03-20",
        creditsEarned: 0.5,
        status: "completed",
      },
    ],
  },
];

export function MultiStudyTracking() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressColor = (current: number, required: number) => {
    const percentage = (current / required) * 100;
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionStatus = (current: number, required: number) => {
    if (current >= required) return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
    if (current >= required * 0.7) return <Badge className="bg-blue-100 text-blue-700">On Track</Badge>;
    if (current >= required * 0.4) return <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>;
    return <Badge className="bg-red-100 text-red-700">At Risk</Badge>;
  };

  const getTotalStats = () => {
    const totalStudents = students.length;
    const completed = students.filter((s) => s.totalCredits >= s.requiredCredits).length;
    const inProgress = students.filter(
      (s) => s.totalCredits < s.requiredCredits && s.totalCredits > 0
    ).length;
    const notStarted = students.filter((s) => s.totalCredits === 0).length;

    return { totalStudents, completed, inProgress, notStarted };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Multi-Study Completion Tracking</h1>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border p-4 rounded text-center">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
            <div className="border p-4 rounded text-center bg-green-50">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <div className="border p-4 rounded text-center bg-blue-50">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
            </div>
            <div className="border p-4 rounded text-center bg-red-50">
              <p className="text-sm text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-red-700">{stats.notStarted}</p>
            </div>
          </div>

          {!selectedStudent ? (
            <>
              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search">Search Students</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-4">
                {filteredStudents.map((student) => {
                  const progressPercentage = (student.totalCredits / student.requiredCredits) * 100;
                  return (
                    <div key={student.id} className="border p-4 rounded">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <p className="text-sm text-gray-600">{student.department}</p>
                        </div>
                        {getCompletionStatus(student.totalCredits, student.requiredCredits)}
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>
                            Credits: {student.totalCredits} / {student.requiredCredits}
                          </span>
                          <span className={getProgressColor(student.totalCredits, student.requiredCredits)}>
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Studies Completed: <strong>{student.studiesCompleted}</strong>
                        </p>
                        <Button size="sm" variant="outline" onClick={() => setSelectedStudent(student)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <p className="text-gray-600 text-center py-12">No students found</p>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setSelectedStudent(null)} className="mb-6">
                ← Back to Student List
              </Button>

              <div className="border p-6 rounded mb-6 bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedStudent.name}</h2>
                    <p className="text-gray-600">{selectedStudent.email}</p>
                    <p className="text-gray-600">{selectedStudent.department}</p>
                  </div>
                  {getCompletionStatus(selectedStudent.totalCredits, selectedStudent.requiredCredits)}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Credits</p>
                    <p className="text-2xl font-bold">{selectedStudent.totalCredits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Required Credits</p>
                    <p className="text-2xl font-bold">{selectedStudent.requiredCredits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Studies Completed</p>
                    <p className="text-2xl font-bold">{selectedStudent.studiesCompleted}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress to Completion</span>
                    <span className={getProgressColor(selectedStudent.totalCredits, selectedStudent.requiredCredits)}>
                      {Math.round((selectedStudent.totalCredits / selectedStudent.requiredCredits) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(selectedStudent.totalCredits / selectedStudent.requiredCredits) * 100}
                    className="h-3"
                  />
                </div>
              </div>

              <h3 className="font-semibold mb-4">Completed Studies</h3>
              <div className="space-y-3">
                {selectedStudent.completions.map((completion, index) => (
                  <div key={index} className="border p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{completion.studyName}</h4>
                        <p className="text-sm text-gray-600">Session: {completion.sessionId}</p>
                        <p className="text-sm text-gray-600">Date: {completion.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700 mb-2">
                          {completion.status}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          Credits: <strong>{completion.creditsEarned}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

