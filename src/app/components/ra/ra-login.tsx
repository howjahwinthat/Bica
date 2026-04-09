import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { Clock } from "lucide-react";

type LoginForm = {
  email: string;
  password: string;
};

export function RALogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">RA Login</h1>
        <p className="text-gray-500 text-sm mb-6">Research Assistant Portal</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email *</Label>
            <Input type="email" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
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
    </div>
  );
}