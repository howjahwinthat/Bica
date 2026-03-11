import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type StudyFormData = {
  studyName: string;
  principalInvestigator: string;
  department: string;
  studyType: string;
  duration: string;
  credits: string;
  description: string;
  eligibilityCriteria: string;
  isActive: boolean;
  requiresPrescreen: boolean;
};

export function CreateStudy() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<StudyFormData>({
    defaultValues: {
      isActive: true,
      requiresPrescreen: false,
    },
  });

  const onSubmit = (data: StudyFormData) => {
    console.log("Study created:", data);
    toast.success("Study record created successfully!");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="link" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Create New Study</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="studyName">Study Name *</Label>
              <Input
                id="studyName"
                {...register("studyName", { required: "Study name is required" })}
                placeholder="e.g., Cognitive Psychology Study 2026"
              />
              {errors.studyName && (
                <p className="text-sm text-red-600 mt-1">{errors.studyName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="principalInvestigator">Principal Investigator *</Label>
              <Input
                id="principalInvestigator"
                {...register("principalInvestigator", { required: "PI name is required" })}
                placeholder="Dr. Jane Smith"
              />
              {errors.principalInvestigator && (
                <p className="text-sm text-red-600 mt-1">{errors.principalInvestigator.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                {...register("department", { required: "Department is required" })}
                placeholder="Psychology"
              />
              {errors.department && (
                <p className="text-sm text-red-600 mt-1">{errors.department.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="studyType">Study Type *</Label>
              <select
                id="studyType"
                {...register("studyType", { required: "Study type is required" })}
                className="block w-full mt-1 p-2 border rounded"
              >
                <option value="">Select type</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {errors.studyType && (
                <p className="text-sm text-red-600 mt-1">{errors.studyType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { required: "Duration is required" })}
                placeholder="30"
              />
              {errors.duration && (
                <p className="text-sm text-red-600 mt-1">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="credits">Credits Awarded *</Label>
              <Input
                id="credits"
                type="number"
                step="0.5"
                {...register("credits", { required: "Credits are required" })}
                placeholder="1.0"
              />
              {errors.credits && (
                <p className="text-sm text-red-600 mt-1">{errors.credits.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Study Description *</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                placeholder="Describe the purpose and procedures of the study..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
              <Textarea
                id="eligibilityCriteria"
                {...register("eligibilityCriteria")}
                placeholder="e.g., Must be 18 years or older, native English speaker..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Create Study
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
