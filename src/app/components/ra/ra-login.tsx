import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

type LoginForm = {
  email: string;
  password: string;
};

export function RALogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setErrorMessage(null);
    try {
      const res = await fetch("http://localhost:3600/api/ra/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      const result = await res.json();
      login(result.user, result.token);
      toast.success("Welcome back!");
      navigate("/ra/dashboard");
    } catch (err: any) {
      const message = err.message || "Login failed";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">

        {/* Back to Home button */}
        <Button
          variant="link"
          className="mb-4 p-0 text-gray-500 hover:text-gray-700"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2 inline-block" /> Back to Home
        </Button>

        <h1 className="text-2xl font-bold mb-2">RA Login</h1>
        <p className="text-gray-500 text-sm mb-6">Research Assistant Portal</p>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

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

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/ra/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  );
}