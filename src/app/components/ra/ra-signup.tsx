import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FlaskConical, Mail, Lock, User, BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";

type SignupForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
};

export function RASignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3600/api/ra/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          department: data.department,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      toast.success("Account created! You can now log in.");
      navigate("/ra/login");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F4F6F9' }}>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #003580 0%, #0047AB 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(192,192,192,0.3)' }}>
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-white font-bold text-lg">BICA+</span>
        </div>

        <div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <FlaskConical className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join as a<br />Researcher
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Create your researcher account to start submitting and managing university research studies.
          </p>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-white font-semibold mb-2">What you can do:</p>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li>🔬 Submit research studies for approval</li>
            <li>📅 Schedule and manage sessions</li>
            <li>👥 Track participant registrations</li>
            <li>🎓 Complete training workflows</li>
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm transition-colors" style={{ color: '#003580' }}>
              ← Back to Home
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#003580' }}>Create Researcher Account</h1>
            <p className="text-gray-500">Sign up to start managing research studies.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register("first_name", { required: "Required" })}
                    placeholder="Jane"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all" />
                </div>
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input {...register("last_name", { required: "Required" })}
                    placeholder="Doe"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all" />
                </div>
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">University Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" {...register("email", { required: "Email is required" })}
                  placeholder="researcher@university.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select {...register("department", { required: "Department is required" })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all appearance-none">
                  <option value="">Select department</option>
                  {["Psychology","Computer Science","Cyber Security","Information Science","Biology","Business","English","History","Chemistry","Accounting","Communication"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all" />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: val => val === watch("password") || "Passwords do not match",
                })}
                  placeholder="Repeat your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: loading ? '#C0C0C0' : '#003580' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : 'Create Researcher Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/ra/login" className="font-semibold hover:underline" style={{ color: '#003580' }}>
              Sign In
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-6">
            BICA+ Research Management System · Researcher Portal
          </p>
        </div>
      </div>
    </div>
  );
}