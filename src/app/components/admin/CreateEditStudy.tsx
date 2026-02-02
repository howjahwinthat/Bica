import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Progress } from '@/app/components/ui/progress';
import { useAuth } from '@/app/context/AuthContext';
import { mockStudies } from '@/app/data/mockData';
import { ArrowLeft, CheckCircle2, Loader2, Database } from 'lucide-react';

type SaveStep = 'form' | 'validating' | 'saving' | 'success';

export function CreateEditStudy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveStep, setSaveStep] = useState<SaveStep>('form');
  const [progress, setProgress] = useState(0);

  const existingStudy = id ? mockStudies.find((s) => s.id === id) : null;
  const isEdit = !!existingStudy;

  const [formData, setFormData] = useState({
    title: existingStudy?.title || '',
    description: existingStudy?.description || '',
    credits: existingStudy?.credits?.toString() || '',
    duration: existingStudy?.duration || '',
    studyType: existingStudy?.type || 'In-Person',
    maxParticipants: existingStudy?.maxParticipants?.toString() || '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStep('validating');
    setProgress(0);

    // Simulate validation
    const validationInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(validationInterval);
          setSaveStep('saving');
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      setSaveStep('saving');
      setProgress(0);

      // Simulate saving
      const savingInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(savingInterval);
            setSaveStep('success');
            return 100;
          }
          return prev + 8;
        });
      }, 200);
    }, 1500);
  };

  if (saveStep === 'success') {
    const studyId = existingStudy?.id || 'STD-2025-0042';
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link to="/admin/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            </div>
            <h2 className="text-3xl font-semibold mb-2">Study Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your study has been saved and is now available to students
            </p>

            <Card className="p-6 bg-gray-50 text-left mb-6">
              <h3 className="font-semibold mb-4">{formData.title}</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Study ID</p>
                  <p className="font-medium">{studyId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Credits</p>
                  <p className="font-medium">{formData.credits} Credits</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{formData.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{formData.studyType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">McMurran Hall, Room 204</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Participants</p>
                  <p className="font-medium">{formData.maxParticipants} slots</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Date Range</p>
                <p className="font-medium">Dec 9 - Dec 15, 2025</p>
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-600" />
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-blue-900">Database Updated</p>
                <p className="text-sm text-blue-700">Study information saved at 12:04:33 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/admin/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
              <Link to="/admin/study/new" className="flex-1">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Create Another Study
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (saveStep === 'validating' || saveStep === 'saving') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="flex justify-center mb-6">
            {saveStep === 'validating' ? (
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
            ) : (
              <Database className="w-16 h-16 text-purple-600 animate-pulse" />
            )}
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            {saveStep === 'validating' ? 'Validating Study Information' : 'Saving to Database'}
          </h2>
          <p className="text-gray-600 mb-6">
            {saveStep === 'validating'
              ? 'Please wait while we validate your study information...'
              : 'Please wait while we save your study information...'}
          </p>

          <Progress value={progress} className="mb-6" />

          <div className="space-y-3 text-left">
            {saveStep === 'validating' ? (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Validating study information</span>
                </div>
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                  <span className="text-sm">Checking for conflicts</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Validating study information</span>
                </div>
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                  <span className="text-sm">Saving to database</span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  <span className="text-sm">Creating time slots</span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  <span className="text-sm">Publishing study</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/admin/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">DS</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                {isEdit ? 'Edit Study' : 'Create New Study'}
              </h1>
              <p className="text-gray-600">Enter the study details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Study Title *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sleep Pattern Research"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A comprehensive study examining sleep patterns and their impact on cognitive performance..."
                required
                className="mt-1 min-h-24"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="credits">Credits *</Label>
                <Input
                  id="credits"
                  type="number"
                  step="0.5"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  placeholder="3"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration (mins) *</Label>
                <Input
                  id="duration"
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="45-60"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="studyType">Study Type *</Label>
                <Select
                  value={formData.studyType}
                  onValueChange={(value) => setFormData({ ...formData, studyType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxParticipants">Max Participants *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData({ ...formData, maxParticipants: e.target.value })
                  }
                  placeholder="12"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link to="/admin/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                {isEdit ? 'Update Study' : 'Create Study'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}