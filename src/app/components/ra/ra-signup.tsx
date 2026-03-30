import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">RA Sign Up</h1>
        <p className="text-gray-500 text-sm mb-6">Create your Research Assistant account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>First Name *</Label>
              <Input {...register("first_name", { required: "Required" })} />
              {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input {...register("last_name", { required: "Required" })} />
              {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <Label>Email *</Label>
            <Input type="email" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label>Department *</Label>
            <select
              {...register("department", { required: "Department is required" })}
              className="block w-full mt-1 p-2 border rounded"
            >
              <option value="">Select department</option>
              <option value="Psychology">Psychology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Information Science">Information Science</option>
              <option value="Biology">Biology</option>
              <option value="Business">Business</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Accounting">Accounting</option>
              <option value="Communication">Communication</option>
            </select>
            {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>}
          </div>

          <div>
            <Label>Password *</Label>
            <Input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <Label>Confirm Password *</Label>
            <Input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full">Create Account</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/ra/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
}