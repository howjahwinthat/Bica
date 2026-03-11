import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, PlayCircle, CheckCircle, Lock } from "lucide-react";

type Module = {
  id: string;
  title: string;
  description: string;
  type: "video" | "document" | "quiz";
  duration: string;
  completed: boolean;
  locked: boolean;
};

type Workflow = {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  progress: number;
};

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "New Researcher Onboarding",
    description: "Essential training for new research assistants and principal investigators",
    progress: 60,
    modules: [
      {
        id: "1-1",
        title: "Introduction to SONA",
        description: "Overview of the SONA system and its features",
        type: "video",
        duration: "15 min",
        completed: true,
        locked: false,
      },
      {
        id: "1-2",
        title: "Creating Your First Study",
        description: "Step-by-step guide to setting up a research study",
        type: "video",
        duration: "20 min",
        completed: true,
        locked: false,
      },
      {
        id: "1-3",
        title: "Knowledge Check: Basics",
        description: "Test your understanding of core concepts",
        type: "quiz",
        duration: "5 min",
        completed: false,
        locked: false,
      },
    ],
  },
  {
    id: "2",
    name: "Data Management & Privacy",
    description: "Learn best practices for handling participant data securely",
    progress: 0,
    modules: [
      {
        id: "2-1",
        title: "GDPR & Privacy Regulations",
        description: "Understanding data protection requirements",
        type: "document",
        duration: "15 min",
        completed: false,
        locked: false,
      },
    ],
  },
];

export function TrainingOnboarding() {
  const navigate = useNavigate();
  const [workflows] = useState(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const handleStartModule = (moduleId: string) => {
    console.log("Starting module:", moduleId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => selectedWorkflow ? setSelectedWorkflow(null) : navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> 
            {selectedWorkflow ? "Back to Workflows" : "Back to Dashboard"}
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Training & Onboarding</h1>

          {!selectedWorkflow ? (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="border p-4 rounded">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{workflow.name}</h3>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                    {workflow.progress === 100 && (
                      <Badge className="bg-green-100 text-green-700">Completed</Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>
                        {workflow.modules.filter((m) => m.completed).length} of{" "}
                        {workflow.modules.length} modules completed
                      </span>
                      <span>{Math.round(workflow.progress)}%</span>
                    </div>
                    <Progress value={workflow.progress} className="h-2" />
                  </div>

                  <Button onClick={() => setSelectedWorkflow(workflow)}>
                    {workflow.progress === 0 ? "Start Workflow" : "Continue"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{selectedWorkflow.name}</h2>
                <p className="text-gray-600 mb-4">{selectedWorkflow.description}</p>

                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round(selectedWorkflow.progress)}%</span>
                  </div>
                  <Progress value={selectedWorkflow.progress} className="h-3" />
                </div>
              </div>

              <div className="space-y-3">
                {selectedWorkflow.modules.map((module) => (
                  <div key={module.id} className="border p-4 rounded flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{module.title}</h4>
                        {module.completed && <CheckCircle className="text-green-600" size={16} />}
                        {module.locked && <Lock className="text-gray-400" size={16} />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                      <p className="text-sm text-gray-500">
                        {module.type} • {module.duration}
                      </p>
                    </div>

                    <div className="ml-4">
                      {module.completed ? (
                        <Button variant="outline" size="sm" disabled>
                          Completed
                        </Button>
                      ) : module.locked ? (
                        <Button variant="outline" size="sm" disabled>
                          Locked
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleStartModule(module.id)}>
                          <PlayCircle size={14} className="mr-2" />
                          Start
                        </Button>
                      )}
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