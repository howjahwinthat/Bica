import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, CheckCircle, Lock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

type Question = {
  question_id: number;
  question: string;
  type: "multiple_choice" | "true_false";
  options: string[];
  correct_answer: string;
};

type Module = {
  module_id: number;
  workflow_id: number;
  title: string;
  description: string;
  type: "guide" | "quiz";
  content: string | null;
  order_index: number;
  questions?: Question[];
};

type Workflow = {
  workflow_id: number;
  title: string;
  description: string;
  modules: Module[];
};

type Progress = {
  module_id: number;
  completed: boolean;
  score: number | null;
};

export function TrainingOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ title: "", description: "" });

  const [showCreateModule, setShowCreateModule] = useState(false);
  const [newModule, setNewModule] = useState({ title: "", description: "", type: "guide" as "guide" | "quiz", content: "" });

  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [selectedModuleForQuestion, setSelectedModuleForQuestion] = useState<Module | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "multiple_choice" as "multiple_choice" | "true_false",
    options: ["", "", "", ""],
    correct_answer: "",
  });

  useEffect(() => {
    seedAndFetch();
  }, []);

  const seedAndFetch = async () => {
    try {
      await fetch("http://localhost:3600/api/training/seed", { method: "POST" });
      await fetchWorkflows();
      if (user?.id) await fetchProgress();
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    const res = await fetch("http://localhost:3600/api/training/workflows");
    if (res.ok) {
      const data = await res.json();
      setWorkflows(data);
    }
  };

  const fetchProgress = async () => {
    const res = await fetch(`http://localhost:3600/api/training/progress/${user?.id}`);
    if (res.ok) {
      const data = await res.json();
      setProgress(data.map((p: any) => ({ ...p, completed: !!p.completed })));
    }
  };

  const isModuleCompleted = (moduleId: number) => progress.some((p) => p.module_id === moduleId && p.completed);

  const isModuleLocked = (workflow: Workflow, moduleIndex: number) => {
    if (moduleIndex === 0) return false;
    return !isModuleCompleted(workflow.modules[moduleIndex - 1].module_id);
  };

  const getWorkflowProgress = (workflow: Workflow) => {
    if (!workflow.modules.length) return 0;
    const completed = workflow.modules.filter((m) => isModuleCompleted(m.module_id)).length;
    return Math.round((completed / workflow.modules.length) * 100);
  };

  const handleMarkComplete = async (module: Module) => {
    if (!user?.id) return;
    await fetch("http://localhost:3600/api/training/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, module_id: module.module_id, completed: true, score: null }),
    });
    await fetchProgress();
    toast.success("Module marked as complete!");
    setSelectedModule(null);
  };

  const handleSubmitQuiz = async () => {
    if (!selectedModule?.questions || !user?.id) return;
    let correct = 0;
    selectedModule.questions.forEach((q) => {
      if (quizAnswers[q.question_id] === q.correct_answer) correct++;
    });
    const score = Math.round((correct / selectedModule.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    await fetch("http://localhost:3600/api/training/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, module_id: selectedModule.module_id, completed: true, score }),
    });
    await fetchProgress();
  };

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.title) return toast.error("Title is required");
    const res = await fetch("http://localhost:3600/api/training/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWorkflow),
    });
    if (res.ok) {
      toast.success("Workflow created!");
      setNewWorkflow({ title: "", description: "" });
      setShowCreateWorkflow(false);
      await fetchWorkflows();
    }
  };

  const handleDeleteWorkflow = async (workflowId: number) => {
    if (!window.confirm("Delete this workflow and all its modules?")) return;
    await fetch(`http://localhost:3600/api/training/workflows/${workflowId}`, { method: "DELETE" });
    toast.success("Workflow deleted");
    await fetchWorkflows();
    setSelectedWorkflow(null);
  };

  const handleCreateModule = async () => {
    if (!newModule.title || !selectedWorkflow) return toast.error("Title is required");
    const res = await fetch("http://localhost:3600/api/training/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow_id: selectedWorkflow.workflow_id,
        title: newModule.title,
        description: newModule.description,
        type: newModule.type,
        content: newModule.content,
        order_index: selectedWorkflow.modules.length,
      }),
    });
    if (res.ok) {
      toast.success("Module created!");
      setNewModule({ title: "", description: "", type: "guide", content: "" });
      setShowCreateModule(false);
      await fetchWorkflows();
      const updated = workflows.find((w) => w.workflow_id === selectedWorkflow.workflow_id);
      if (updated) setSelectedWorkflow(updated);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!window.confirm("Delete this module?")) return;
    await fetch(`http://localhost:3600/api/training/modules/${moduleId}`, { method: "DELETE" });
    toast.success("Module deleted");
    await fetchWorkflows();
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.question || !newQuestion.correct_answer || !selectedModuleForQuestion) {
      return toast.error("Please fill in all fields");
    }
    const options = newQuestion.type === "true_false" ? ["True", "False"] : newQuestion.options.filter(Boolean);
    const res = await fetch("http://localhost:3600/api/training/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module_id: selectedModuleForQuestion.module_id,
        question: newQuestion.question,
        type: newQuestion.type,
        options,
        correct_answer: newQuestion.correct_answer,
      }),
    });
    if (res.ok) {
      toast.success("Question added!");
      setNewQuestion({ question: "", type: "multiple_choice", options: ["", "", "", ""], correct_answer: "" });
      setShowCreateQuestion(false);
      setSelectedModuleForQuestion(null);
      await fetchWorkflows();
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("Delete this question?")) return;
    await fetch(`http://localhost:3600/api/training/questions/${questionId}`, { method: "DELETE" });
    toast.success("Question deleted");
    await fetchWorkflows();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  // MODULE VIEW
  if (selectedModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="link" onClick={() => { setSelectedModule(null); setQuizAnswers({}); setQuizSubmitted(false); }}>
              <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Workflow
            </Button>
          </div>

          <Card className="p-8">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{selectedModule.type}</Badge>
              {isModuleCompleted(selectedModule.module_id) && (
                <Badge className="bg-green-100 text-green-700">Completed</Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold mb-2">{selectedModule.title}</h1>
            <p className="text-gray-600 mb-6">{selectedModule.description}</p>

            {selectedModule.type === "guide" && (
              <>
                <div className="prose max-w-none bg-gray-50 rounded p-6 mb-6 whitespace-pre-wrap text-gray-800">
                  {selectedModule.content}
                </div>
                {!isModuleCompleted(selectedModule.module_id) && (
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleMarkComplete(selectedModule)}>
                    Mark as Complete
                  </Button>
                )}
              </>
            )}

            {selectedModule.type === "quiz" && (
              <>
                {!quizSubmitted ? (
                  <div className="space-y-6">
                    {selectedModule.questions?.map((q, i) => (
                      <div key={q.question_id} className="border p-4 rounded bg-white">
                        <p className="font-medium mb-3">{i + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`q-${q.question_id}`}
                                value={opt}
                                checked={quizAnswers[q.question_id] === opt}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [q.question_id]: opt })}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button
                      className="w-full"
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(quizAnswers).length !== selectedModule.questions?.length}
                    >
                      Submit Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`text-5xl font-bold mb-4 ${quizScore >= 70 ? "text-green-600" : "text-red-600"}`}>
                      {quizScore}%
                    </div>
                    <p className="text-gray-600 mb-6">
                      {quizScore >= 70 ? "Great job! You passed." : "You didn't pass. Review the material and try again."}
                    </p>
                    <div className="space-y-3 text-left mb-6">
                      {selectedModule.questions?.map((q, i) => (
                        <div key={q.question_id} className={`border p-3 rounded ${quizAnswers[q.question_id] === q.correct_answer ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                          <p className="font-medium">{i + 1}. {q.question}</p>
                          <p className="text-sm">Your answer: {quizAnswers[q.question_id]}</p>
                          {quizAnswers[q.question_id] !== q.correct_answer && (
                            <p className="text-sm text-green-700">Correct: {q.correct_answer}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => { setSelectedModule(null); setQuizAnswers({}); setQuizSubmitted(false); }}>
                      Back to Workflow
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // WORKFLOW VIEW
  if (selectedWorkflow) {
    const refreshedWorkflow = workflows.find((w) => w.workflow_id === selectedWorkflow.workflow_id) || selectedWorkflow;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="link" onClick={() => setSelectedWorkflow(null)}>
              <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Workflows
            </Button>
          </div>

          <Card className="p-8">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-semibold">{refreshedWorkflow.title}</h1>
              {isAdmin && (
                <Button size="sm" variant="destructive" onClick={() => handleDeleteWorkflow(refreshedWorkflow.workflow_id)}>
                  <Trash2 size={14} className="mr-1" /> Delete Workflow
                </Button>
              )}
            </div>
            <p className="text-gray-600 mb-4">{refreshedWorkflow.description}</p>

            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{getWorkflowProgress(refreshedWorkflow)}%</span>
              </div>
              <Progress value={getWorkflowProgress(refreshedWorkflow)} className="h-3" />
            </div>

            <div className="space-y-3 mb-6">
              {refreshedWorkflow.modules.map((module, index) => {
                const locked = isModuleLocked(refreshedWorkflow, index);
                const completed = isModuleCompleted(module.module_id);
                return (
                  <div key={module.module_id} className="border p-4 rounded flex items-start justify-between bg-white">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{module.title}</h4>
                        {completed && <CheckCircle className="text-green-600" size={16} />}
                        {locked && <Lock className="text-gray-400" size={16} />}
                        <Badge variant="outline">{module.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!locked && (
                        <Button size="sm" onClick={() => { setSelectedModule(module); setQuizAnswers({}); setQuizSubmitted(false); }}>
                          {completed ? "Review" : "Start"}
                        </Button>
                      )}
                      {locked && <Button size="sm" variant="outline" disabled>Locked</Button>}
                      {isAdmin && (
                        <>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteModule(module.module_id)}>
                            <Trash2 size={14} />
                          </Button>
                          {module.type === "quiz" && (
                            <Button size="sm" variant="outline" onClick={() => { setSelectedModuleForQuestion(module); setShowCreateQuestion(true); }}>
                              <Plus size={14} className="mr-1" /> Question
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {isAdmin && showCreateQuestion && selectedModuleForQuestion && (
              <div className="border p-4 rounded bg-yellow-50 mb-4">
                <h3 className="font-semibold mb-3">Add Question to "{selectedModuleForQuestion.title}"</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Question</Label>
                    <Input value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select
                      className="block w-full mt-1 p-2 border rounded"
                      value={newQuestion.type}
                      onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True / False</option>
                    </select>
                  </div>
                  {newQuestion.type === "multiple_choice" && (
                    <div>
                      <Label>Options</Label>
                      {newQuestion.options.map((opt, i) => (
                        <Input
                          key={i}
                          className="mb-1"
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const opts = [...newQuestion.options];
                            opts[i] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: opts });
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div>
                    <Label>Correct Answer</Label>
                    <Input value={newQuestion.correct_answer} onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateQuestion} className="flex-1">Add Question</Button>
                    <Button variant="outline" onClick={() => { setShowCreateQuestion(false); setSelectedModuleForQuestion(null); }}>Cancel</Button>
                  </div>
                </div>

                {selectedModuleForQuestion.questions && selectedModuleForQuestion.questions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Existing Questions</h4>
                    {selectedModuleForQuestion.questions.map((q) => (
                      <div key={q.question_id} className="flex items-center justify-between border p-2 rounded mb-1 bg-white">
                        <span className="text-sm">{q.question}</span>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteQuestion(q.question_id)}>
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isAdmin && (
              showCreateModule ? (
                <div className="border p-4 rounded bg-blue-50">
                  <h3 className="font-semibold mb-3">Add New Module</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Title</Label>
                      <Input value={newModule.title} onChange={(e) => setNewModule({ ...newModule, title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input value={newModule.description} onChange={(e) => setNewModule({ ...newModule, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <select
                        className="block w-full mt-1 p-2 border rounded"
                        value={newModule.type}
                        onChange={(e) => setNewModule({ ...newModule, type: e.target.value as "guide" | "quiz" })}
                      >
                        <option value="guide">Guide</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                    {newModule.type === "guide" && (
                      <div>
                        <Label>Content</Label>
                        <Textarea rows={6} value={newModule.content} onChange={(e) => setNewModule({ ...newModule, content: e.target.value })} />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handleCreateModule} className="flex-1">Create Module</Button>
                      <Button variant="outline" onClick={() => setShowCreateModule(false)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => setShowCreateModule(true)}>
                  <Plus size={16} className="mr-2" /> Add Module
                </Button>
              )
            )}
          </Card>
        </div>
      </div>
    );
  }

  // WORKFLOWS LIST VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate(user?.role === "researcher" ? "/ra/dashboard" : "/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Training & Onboarding</h1>

          <div className="space-y-4 mb-6">
            {workflows.map((workflow) => {
              const prog = getWorkflowProgress(workflow);
              return (
                <div key={workflow.workflow_id} className="border p-4 rounded bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{workflow.title}</h3>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                    {prog === 100 && <Badge className="bg-green-100 text-green-700">Completed</Badge>}
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>
                        {workflow.modules.filter((m) => isModuleCompleted(m.module_id)).length} of{" "}
                        {workflow.modules.length} modules completed
                      </span>
                      <span>{prog}%</span>
                    </div>
                    <Progress value={prog} className="h-2" />
                  </div>
                  <Button onClick={() => setSelectedWorkflow(workflow)}>
                    {prog === 0 ? "Start Workflow" : prog === 100 ? "Review" : "Continue"}
                  </Button>
                </div>
              );
            })}
          </div>

          {isAdmin && (
            showCreateWorkflow ? (
              <div className="border p-4 rounded bg-blue-50">
                <h3 className="font-semibold mb-3">Create New Workflow</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input value={newWorkflow.title} onChange={(e) => setNewWorkflow({ ...newWorkflow, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea rows={2} value={newWorkflow.description} onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateWorkflow} className="flex-1">Create Workflow</Button>
                    <Button variant="outline" onClick={() => setShowCreateWorkflow(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setShowCreateWorkflow(true)}>
                <Plus size={16} className="mr-2" /> Create New Workflow
              </Button>
            )
          )}
        </Card>
      </div>
    </div>
  );
}