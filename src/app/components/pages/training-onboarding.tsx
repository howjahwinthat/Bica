import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { GraduationCap, CheckCircle, Lock, Plus, Trash2, ArrowLeft, BookOpen, HelpCircle, Loader2 } from "lucide-react";
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

type ProgressItem = {
  module_id: number;
  completed: boolean;
  score: number | null;
};

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all";
const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

export function TrainingOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
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
  const [newQuestion, setNewQuestion] = useState({ question: "", type: "multiple_choice" as "multiple_choice" | "true_false", options: ["", "", "", ""], correct_answer: "" });

  useEffect(() => { seedAndFetch(); }, []);

  const seedAndFetch = async () => {
    try {
      await fetch("http://localhost:3600/api/training/seed", { method: "POST" });
      await fetchWorkflows();
      if (user?.id) await fetchProgress();
    } finally { setLoading(false); }
  };

  const fetchWorkflows = async () => {
    const res = await fetch("http://localhost:3600/api/training/workflows");
    if (res.ok) setWorkflows(await res.json());
  };

  const fetchProgress = async () => {
    const res = await fetch(`http://localhost:3600/api/training/progress/${user?.id}`);
    if (res.ok) {
      const data = await res.json();
      setProgress(data.map((p: any) => ({ ...p, completed: !!p.completed })));
    }
  };

  const isModuleCompleted = (moduleId: number) => progress.some(p => p.module_id === moduleId && p.completed);
  const isModuleLocked = (workflow: Workflow, idx: number) => idx > 0 && !isModuleCompleted(workflow.modules[idx - 1].module_id);
  const getWorkflowProgress = (workflow: Workflow) => {
    if (!workflow.modules.length) return 0;
    return Math.round((workflow.modules.filter(m => isModuleCompleted(m.module_id)).length / workflow.modules.length) * 100);
  };

  const handleMarkComplete = async (module: Module) => {
    if (!user?.id) return;
    await fetch("http://localhost:3600/api/training/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, module_id: module.module_id, completed: true, score: null }),
    });
    await fetchProgress();
    toast.success("Module completed!");
    setSelectedModule(null);
  };

  const handleSubmitQuiz = async () => {
    if (!selectedModule?.questions || !user?.id) return;
    let correct = 0;
    selectedModule.questions.forEach(q => { if (quizAnswers[q.question_id] === q.correct_answer) correct++; });
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
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newWorkflow),
    });
    if (res.ok) { toast.success("Workflow created!"); setNewWorkflow({ title: "", description: "" }); setShowCreateWorkflow(false); await fetchWorkflows(); }
  };

  const handleDeleteWorkflow = async (id: number) => {
    if (!window.confirm("Delete this workflow?")) return;
    await fetch(`http://localhost:3600/api/training/workflows/${id}`, { method: "DELETE" });
    toast.success("Workflow deleted"); await fetchWorkflows(); setSelectedWorkflow(null);
  };

  const handleCreateModule = async () => {
    if (!newModule.title || !selectedWorkflow) return toast.error("Title is required");
    const res = await fetch("http://localhost:3600/api/training/modules", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow_id: selectedWorkflow.workflow_id, ...newModule, order_index: selectedWorkflow.modules.length }),
    });
    if (res.ok) { toast.success("Module created!"); setNewModule({ title: "", description: "", type: "guide", content: "" }); setShowCreateModule(false); await fetchWorkflows(); }
  };

  const handleDeleteModule = async (id: number) => {
    if (!window.confirm("Delete this module?")) return;
    await fetch(`http://localhost:3600/api/training/modules/${id}`, { method: "DELETE" });
    toast.success("Module deleted"); await fetchWorkflows();
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.question || !newQuestion.correct_answer || !selectedModuleForQuestion) return toast.error("Fill in all fields");
    const options = newQuestion.type === "true_false" ? ["True", "False"] : newQuestion.options.filter(Boolean);
    const res = await fetch("http://localhost:3600/api/training/questions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module_id: selectedModuleForQuestion.module_id, ...newQuestion, options }),
    });
    if (res.ok) { toast.success("Question added!"); setNewQuestion({ question: "", type: "multiple_choice", options: ["", "", "", ""], correct_answer: "" }); setShowCreateQuestion(false); setSelectedModuleForQuestion(null); await fetchWorkflows(); }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm("Delete this question?")) return;
    await fetch(`http://localhost:3600/api/training/questions/${id}`, { method: "DELETE" });
    toast.success("Question deleted"); await fetchWorkflows();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F6F9' }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#003580' }} />
    </div>
  );

  // MODULE VIEW
  if (selectedModule) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
        <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => { setSelectedModule(null); setQuizAnswers({}); setQuizSubmitted(false); }}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Workflow
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                {selectedModule.type === 'guide' ? <BookOpen className="w-5 h-5 text-white" /> : <HelpCircle className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedModule.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                    {selectedModule.type}
                  </span>
                  {isModuleCompleted(selectedModule.module_id) && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-green-400 text-white">Completed</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-8">
          {selectedModule.description && <p className="text-gray-500 mb-6">{selectedModule.description}</p>}

          {selectedModule.type === "guide" && (
            <Card className="border-0 shadow-sm">
              <div className="p-6 rounded-t-xl" style={{ backgroundColor: '#EBF0FA', borderBottom: '2px solid #C7D7F0' }}>
                <p className="text-sm font-semibold" style={{ color: '#003580' }}>📖 Study Guide</p>
              </div>
              <div className="p-6 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                {selectedModule.content}
              </div>
              {!isModuleCompleted(selectedModule.module_id) && (
                <div className="p-6 pt-0">
                  <button onClick={() => handleMarkComplete(selectedModule)}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#16A34A' }}>
                    <CheckCircle className="w-4 h-4" /> Mark as Complete
                  </button>
                </div>
              )}
            </Card>
          )}

          {selectedModule.type === "quiz" && !quizSubmitted && (
            <div className="space-y-4">
              {selectedModule.questions?.map((q, i) => (
                <Card key={q.question_id} className="p-6 border-0 shadow-sm">
                  <p className="font-semibold text-gray-800 mb-4">{i + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                        style={{
                          backgroundColor: quizAnswers[q.question_id] === opt ? '#EBF0FA' : '#F4F6F9',
                          border: `2px solid ${quizAnswers[q.question_id] === opt ? '#003580' : 'transparent'}`,
                        }}>
                        <input type="radio" name={`q-${q.question_id}`} value={opt}
                          checked={quizAnswers[q.question_id] === opt}
                          onChange={() => setQuizAnswers({ ...quizAnswers, [q.question_id]: opt })}
                          className="hidden" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${quizAnswers[q.question_id] === opt ? 'border-blue-600' : 'border-gray-300'}`}>
                          {quizAnswers[q.question_id] === opt && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#003580' }} />}
                        </div>
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              ))}
              <button onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length !== selectedModule.questions?.length}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: Object.keys(quizAnswers).length === selectedModule.questions?.length ? '#003580' : '#C0C0C0' }}>
                Submit Quiz
              </button>
            </div>
          )}

          {selectedModule.type === "quiz" && quizSubmitted && (
            <Card className="p-8 border-0 shadow-sm text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: quizScore >= 70 ? '#F0FDF4' : '#FEF2F2' }}>
                <p className={`text-3xl font-bold ${quizScore >= 70 ? 'text-green-600' : 'text-red-500'}`}>{quizScore}%</p>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#003580' }}>
                {quizScore >= 70 ? '🎉 Great job! You passed.' : 'Review and try again.'}
              </h2>
              <p className="text-gray-500 mb-6">
                {quizScore >= 70 ? 'Module completed successfully.' : 'You need 70% to pass.'}
              </p>
              <div className="space-y-3 text-left mb-6">
                {selectedModule.questions?.map((q, i) => (
                  <div key={q.question_id} className="p-4 rounded-xl"
                    style={{ backgroundColor: quizAnswers[q.question_id] === q.correct_answer ? '#F0FDF4' : '#FEF2F2' }}>
                    <p className="font-semibold text-sm text-gray-800">{i + 1}. {q.question}</p>
                    <p className="text-xs text-gray-500 mt-1">Your answer: {quizAnswers[q.question_id]}</p>
                    {quizAnswers[q.question_id] !== q.correct_answer && (
                      <p className="text-xs text-green-600 mt-0.5">Correct: {q.correct_answer}</p>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => { setSelectedModule(null); setQuizAnswers({}); setQuizSubmitted(false); }}
                className="px-8 py-3 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: '#003580' }}>
                Back to Workflow
              </button>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // WORKFLOW VIEW
  if (selectedWorkflow) {
    const wf = workflows.find(w => w.workflow_id === selectedWorkflow.workflow_id) || selectedWorkflow;
    const prog = getWorkflowProgress(wf);

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
        <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setSelectedWorkflow(null)}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Workflows
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{wf.title}</h1>
                <p className="text-blue-200 text-sm mt-1">{wf.description}</p>
              </div>
              {isAdmin && (
                <button onClick={() => handleDeleteWorkflow(wf.workflow_id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/20 text-sm transition-all">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-blue-200 mb-2">
                <span>{wf.modules.filter(m => isModuleCompleted(m.module_id)).length} of {wf.modules.length} modules completed</span>
                <span>{prog}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, backgroundColor: '#86EFAC' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-8 space-y-4">
          {wf.modules.map((module, index) => {
            const locked = isModuleLocked(wf, index);
            const completed = isModuleCompleted(module.module_id);
            return (
              <Card key={module.module_id} className="border-0 shadow-sm overflow-hidden">
                <div className="p-1" style={{ backgroundColor: completed ? '#16A34A' : locked ? '#9CA3AF' : '#003580' }} />
                <div className="p-5 flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: completed ? '#F0FDF4' : locked ? '#F3F4F6' : '#EBF0FA' }}>
                      {completed ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                        locked ? <Lock className="w-5 h-5 text-gray-400" /> :
                        module.type === 'guide' ? <BookOpen className="w-5 h-5" style={{ color: '#003580' }} /> :
                        <HelpCircle className="w-5 h-5" style={{ color: '#003580' }} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800">{module.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: module.type === 'guide' ? '#EBF0FA' : '#F3E8FF', color: module.type === 'guide' ? '#003580' : '#6B21A8' }}>
                          {module.type}
                        </span>
                        {completed && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">Done</span>}
                      </div>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    {!locked && (
                      <button onClick={() => { setSelectedModule(module); setQuizAnswers({}); setQuizSubmitted(false); }}
                        className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                        style={{ backgroundColor: '#003580' }}>
                        {completed ? 'Review' : 'Start'}
                      </button>
                    )}
                    {locked && <button disabled className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400">Locked</button>}
                    {isAdmin && (
                      <>
                        <button onClick={() => handleDeleteModule(module.module_id)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors border border-red-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {module.type === "quiz" && (
                          <button onClick={() => { setSelectedModuleForQuestion(module); setShowCreateQuestion(true); }}
                            className="px-3 py-2 rounded-xl text-sm font-semibold transition-all border"
                            style={{ borderColor: '#003580', color: '#003580' }}>
                            + Q
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {isAdmin && showCreateQuestion && selectedModuleForQuestion && (
            <Card className="p-6 border-0 shadow-sm" style={{ borderLeft: '4px solid #F59E0B' }}>
              <h3 className="font-bold mb-4" style={{ color: '#003580' }}>Add Question to "{selectedModuleForQuestion.title}"</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Question</label>
                  <input value={newQuestion.question} onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={newQuestion.type} onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value as any })} className={inputClass}>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True / False</option>
                  </select>
                </div>
                {newQuestion.type === "multiple_choice" && (
                  <div>
                    <label className={labelClass}>Options</label>
                    <div className="space-y-2">
                      {newQuestion.options.map((opt, i) => (
                        <input key={i} placeholder={`Option ${i + 1}`} value={opt}
                          onChange={e => { const opts = [...newQuestion.options]; opts[i] = e.target.value; setNewQuestion({ ...newQuestion, options: opts }); }}
                          className={inputClass} />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className={labelClass}>Correct Answer</label>
                  <input value={newQuestion.correct_answer} onChange={e => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })} className={inputClass} />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreateQuestion} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: '#003580' }}>Add Question</button>
                  <button onClick={() => { setShowCreateQuestion(false); setSelectedModuleForQuestion(null); }} className="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600">Cancel</button>
                </div>
                {selectedModuleForQuestion.questions && selectedModuleForQuestion.questions.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm text-gray-700 mb-2">Existing Questions</p>
                    {selectedModuleForQuestion.questions.map(q => (
                      <div key={q.question_id} className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ backgroundColor: '#F4F6F9' }}>
                        <span className="text-sm text-gray-600">{q.question}</span>
                        <button onClick={() => handleDeleteQuestion(q.question_id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {isAdmin && (
            showCreateModule ? (
              <Card className="p-6 border-0 shadow-sm" style={{ borderLeft: '4px solid #003580' }}>
                <h3 className="font-bold mb-4" style={{ color: '#003580' }}>Add New Module</h3>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input value={newModule.title} onChange={e => setNewModule({ ...newModule, title: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <input value={newModule.description} onChange={e => setNewModule({ ...newModule, description: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <select value={newModule.type} onChange={e => setNewModule({ ...newModule, type: e.target.value as any })} className={inputClass}>
                      <option value="guide">Guide</option>
                      <option value="quiz">Quiz</option>
                    </select>
                  </div>
                  {newModule.type === "guide" && (
                    <div>
                      <label className={labelClass}>Content</label>
                      <textarea rows={6} value={newModule.content} onChange={e => setNewModule({ ...newModule, content: e.target.value })} className={inputClass} />
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={handleCreateModule} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: '#003580' }}>Create Module</button>
                    <button onClick={() => setShowCreateModule(false)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600">Cancel</button>
                  </div>
                </div>
              </Card>
            ) : (
              <button onClick={() => setShowCreateModule(true)}
                className="w-full py-3 rounded-xl font-semibold text-sm border-2 flex items-center justify-center gap-2 transition-all hover:bg-blue-50"
                style={{ borderColor: '#003580', color: '#003580' }}>
                <Plus className="w-4 h-4" /> Add Module
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  // WORKFLOWS LIST
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      <div style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }} className="px-8 py-8">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Training Portal</h1>
            <p className="text-blue-200 text-sm">{workflows.length} training workflows available</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-4">
        {workflows.map(workflow => {
          const prog = getWorkflowProgress(workflow);
          return (
            <Card key={workflow.workflow_id} className="border-0 shadow-sm overflow-hidden">
              <div className="p-1" style={{ backgroundColor: prog === 100 ? '#16A34A' : '#003580' }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{workflow.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{workflow.description}</p>
                  </div>
                  {prog === 100 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>{workflow.modules.filter(m => isModuleCompleted(m.module_id)).length} of {workflow.modules.length} modules</span>
                    <span>{prog}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-gray-100">
                    <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, backgroundColor: prog === 100 ? '#16A34A' : '#003580' }} />
                  </div>
                </div>
                <button onClick={() => setSelectedWorkflow(workflow)}
                  className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: '#003580' }}>
                  {prog === 0 ? 'Start' : prog === 100 ? 'Review' : 'Continue'}
                </button>
              </div>
            </Card>
          );
        })}

        {isAdmin && (
          showCreateWorkflow ? (
            <Card className="p-6 border-0 shadow-sm" style={{ borderLeft: '4px solid #003580' }}>
              <h3 className="font-bold mb-4" style={{ color: '#003580' }}>Create New Workflow</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input value={newWorkflow.title} onChange={e => setNewWorkflow({ ...newWorkflow, title: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea rows={3} value={newWorkflow.description} onChange={e => setNewWorkflow({ ...newWorkflow, description: e.target.value })} className={inputClass} />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreateWorkflow} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: '#003580' }}>Create Workflow</button>
                  <button onClick={() => setShowCreateWorkflow(false)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600">Cancel</button>
                </div>
              </div>
            </Card>
          ) : (
            <button onClick={() => setShowCreateWorkflow(true)}
              className="w-full py-3 rounded-xl font-semibold text-sm border-2 flex items-center justify-center gap-2 transition-all hover:bg-blue-50"
              style={{ borderColor: '#003580', color: '#003580' }}>
              <Plus className="w-4 h-4" /> Create New Workflow
            </button>
          )
        )}
      </div>
    </div>
  );
}