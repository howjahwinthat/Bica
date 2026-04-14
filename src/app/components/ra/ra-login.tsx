import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { Clock } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { FlaskConical, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";

type LoginForm = {
  email: string;
  password: string;
};

export function RALogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3600/api/ra/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      login(result.user, result.token);
      toast.success("Welcome back!");
      navigate("/ra/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
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
            Researcher<br />Portal
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Create and manage research studies, coordinate participants, and track your study progress.
          </p>
        </div>

        <div className="space-y-3">
          {[
            'Create and submit research studies',
            'Manage study sessions and timeslots',
            'Track participant registrations',
            'Access training materials',
          ].map(item => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-blue-200 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm transition-colors" style={{ color: '#003580' }}>
              ← Back to Home
            </Link>
          </div>
          <div>
            <Label>Password *</Label>
            <Input type="password" {...register("password", { required: "Password is required" })} />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full">Log In</Button>
        </form>

        {/* Pending approval info box — always visible so RAs know what to expect */}
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex gap-3">
          <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">Account pending approval?</p>
            <p className="text-sm text-yellow-700 mt-0.5">
              New RA accounts require admin approval before you can log in. If you have been waiting,
              please contact your administrator to get your account activated.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/ra/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </Card>


          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#003580' }}>Researcher Login</h1>
            <p className="text-gray-500">Sign in to your researcher account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" {...register("email", { required: "Email is required" })}
                  placeholder="researcher@university.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" {...register("password", { required: "Password is required" })}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition-all" />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: loading ? '#C0C0C0' : '#003580' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/ra/signup" className="font-semibold hover:underline" style={{ color: '#003580' }}>
              Create Account
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-8">
            BICA+ Research Management System · Researcher Portal
          </p>
        </div>
      </div>
>>>>>>> 86c9d792669fec5b901b60bd060a1260607ba047
    </div>
  );
}