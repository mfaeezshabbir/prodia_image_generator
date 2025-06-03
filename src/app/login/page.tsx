"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { LuArrowLeft, LuAlertCircle } from "react-icons/lu";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Login successful!");
      router.push("/generate");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to login");
      } else {
        setError("Failed to login");
      }
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Login successful!");
      router.push("/generate");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to login with Google");
      } else {
        setError("Failed to login with Google");
      }
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to reset password");
      } else {
        setError("Failed to reset password");
      }
      toast.error("Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <Link 
            href="/"
            className="text-gray-600 hover:text-indigo-600 flex items-center text-sm mb-6"
          >
            <LuArrowLeft className="mr-1" /> Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to continue to ProdiaStudio</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-start">
            <LuAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Forgot password?
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full gradient-bg text-white font-medium py-3 px-4 rounded-lg ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md hover:scale-[1.01] transform"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50"
          }`}
        >
          <FcGoogle className="mr-2 text-xl" />
          Google
        </button>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
