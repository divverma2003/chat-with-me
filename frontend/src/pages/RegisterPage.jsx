import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  MessageCircle,
  User,
  Mail,
  UserLock,
  EyeOff,
  Eye,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";

import AuthImagePattern from "../components/AuthImagePattern";

const RegisterPage = () => {
  // state to check if user has password visibility set to false/true
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { register, isRegistering } = useAuthStore();
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is a required field.");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is a required field.");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(formData.email)) {
      toast.error("Email format is not valid.");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is a required field.");
      return false;
    } else if (formData.password.length < 6) {
      toast.error("Your password must be at least 6 characters long.");
      return false;
    }
    return true;
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // prevent default form submission
    const success = validateForm();

    if (success) {
      register(formData);
    }
  };

  // div to hold the form with a grid setup (2 columns: left and right)
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-5 sm:p-10">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-14 rounded-xl bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/25 transition-colors"
              >
                <MessageCircle className="size-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Chat With Me</h1>
              <h2 className="text-lg font-medium">Create your account</h2>
              <p className="text-base-content/60">
                Start chatting with friends for free by registering!
              </p>
            </div>
          </div>

          {/* FORM */}
          {/* Full Name */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData({ ...formData, fullName: event.target.value })
                  }
                />
              </div>
            </div>
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                />
              </div>
            </div>
            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserLock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({ ...formData, password: event.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Form */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Don't be a stranger, stay in touch!"
        subtitle="Get connected with family, friends, and the rest of our community!"
      />
    </div>
  );
};

export default RegisterPage;
